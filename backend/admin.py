"""Admin (developer) panel — hidden at /x7k9m-admin in frontend."""
import logging
import os
import shutil
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks

from auth import require_admin, require_super_admin, _generate_key, _hash_password_pbkdf2
from db import db

logger = logging.getLogger("atlas.admin")

router = APIRouter(prefix="/api/admin", tags=["admin"])

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def _parse_dt(v):
    if v is None:
        return None
    if isinstance(v, str):
        v = datetime.fromisoformat(v)
    if v.tzinfo is None:
        v = v.replace(tzinfo=timezone.utc)
    return v


@router.get("/ping")
async def ping(admin: dict = Depends(require_admin)):
    return {"ok": True, "email": admin["email"]}


@router.get("/stats")
async def admin_stats(_=Depends(require_admin)):
    now = datetime.now(timezone.utc)
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = today.replace(day=1)

    all_licenses = await db.licenses.find({}, {"_id": 0}).to_list(10000)
    all_users = await db.users.find({}, {"_id": 0}).to_list(10000)
    all_txs = await db.payment_transactions.find({"payment_status": "paid"}, {"_id": 0, "amount": 1, "created_at": 1, "currency": 1}).to_list(10000)

    # Active licenses
    active_count = 0
    inactive_count = 0
    expiring_soon = 0
    for lic in all_licenses:
        is_active = lic.get("active")
        exp = _parse_dt(lic.get("expires_at"))
        
        if exp and exp <= now:
            is_active = False

        if is_active:
            active_count += 1
            if exp and (exp - now).days <= 7:
                expiring_soon += 1
        else:
            inactive_count += 1

    # New users today
    total_users = len(all_users)
    users_today = 0
    for u in all_users:
        cat = _parse_dt(u.get("created_at"))
        if cat and cat >= today:
            users_today += 1

    # Churn this month
    churn = 0
    for lic in all_licenses:
        exp = _parse_dt(lic.get("expires_at"))
        if exp and month_start <= exp < now and not lic.get("active"):
            churn += 1

    # Revenue
    monthly_revenue = 0.0
    for t in all_txs:
        cat = _parse_dt(t.get("created_at"))
        if cat and cat >= month_start:
            monthly_revenue += float(t.get("amount") or 0.0)
    
    monthly_revenue = round(monthly_revenue, 2)
    yearly_forecast = round(monthly_revenue * 12, 2)

    # 12-month growth
    growth = []
    for i in range(11, -1, -1):
        m_start = (now.replace(day=1) - timedelta(days=i * 30))
        m_start = m_start.replace(hour=0, minute=0, second=0, microsecond=0)
        m_end = m_start + timedelta(days=31)
        
        cnt = 0
        for u in all_users:
            cat = _parse_dt(u.get("created_at"))
            if cat and m_start <= cat < m_end:
                cnt += 1
                
        active_cnt = 0
        churn_cnt = 0
        for lic in all_licenses:
            cat = _parse_dt(lic.get("created_at"))
            exp = _parse_dt(lic.get("expires_at"))
            if cat and cat < m_end and exp and exp > m_start and lic.get("active"):
                active_cnt += 1
            if exp and m_start <= exp < m_end and not lic.get("active"):
                churn_cnt += 1
                
        rev = sum(float(t.get("amount") or 0.0) for t in all_txs if _parse_dt(t.get("created_at")) and m_start <= _parse_dt(t.get("created_at")) < m_end)
        
        growth.append({
            "month": m_start.strftime("%Y-%m"),
            "users": cnt,
            "active": active_cnt,
            "revenue": round(rev, 2),
            "churn": churn_cnt
        })

    return {
        "active_count": active_count,
        "inactive_count": inactive_count,
        "expiring_soon": expiring_soon,
        "users_today": users_today,
        "total_users": total_users,
        "churn_this_month": churn,
        "monthly_revenue": monthly_revenue,
        "yearly_forecast": yearly_forecast,
        "growth": growth,
    }


@router.get("/users")
async def list_users(
    q: Optional[str] = None,
    filter: str = "all",
    _=Depends(require_admin),
):
    """Returns enriched users joined with licenses."""
    users = await db.users.find({}, {"_id": 0}).to_list(10000)
    licenses = await db.licenses.find({}, {"_id": 0}).to_list(10000)
    all_stats = await db.atlas_stats.find({}, {"_id": 0}).to_list(10000)
    
    lic_map = {l.get("user_id"): l for l in licenses if l.get("user_id")}
    stats_map = {s.get("license_id"): s for s in all_stats if s.get("license_id")}

    now = datetime.now(timezone.utc)
    out = []
    for u in users:
        lic = lic_map.get(u["user_id"], {})
        stat = stats_map.get(lic.get("license_id"), {})
        
        exp = _parse_dt(lic.get("expires_at"))
        is_active = bool(lic.get("active") and exp and exp > now)
        row = {
            "user_id": u["user_id"],
            "email": u["email"],
            "name": u.get("name"),
            "avatar_url": u.get("avatar_url"),
            "created_at": u.get("created_at"),
            "is_blocked": bool(u.get("is_blocked")),
            "admin_notes": u.get("admin_notes", ""),
            "key": lic.get("key"),
            "mac_id": lic.get("mac_id"),
            "mac_name": lic.get("mac_name"),
            "version": stat.get("version", "—"),
            "active": is_active,
            "expires_at": exp.isoformat() if exp else None,
        }
        if filter == "active" and not is_active:
            continue
        if filter == "inactive" and is_active:
            continue
        if filter == "blocked" and not row["is_blocked"]:
            continue
        if q:
            ql = q.lower()
            if ql not in (row["email"] or "").lower() and ql not in (row["key"] or "").lower():
                continue
        out.append(row)
    return out


@router.post("/users/action")
async def user_action(body: dict, admin: dict = Depends(require_admin)):
    user_id = body.get("user_id")
    action = body.get("action")
    if not user_id or not action:
        raise HTTPException(400, "user_id and action required")
    user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(404, "User not found")
    lic = await db.licenses.find_one({"user_id": user_id}, {"_id": 0})

    log = {
        "action": action,
        "target_user_id": user_id,
        "target_email": user["email"],
        "performed_by": admin["email"],
        "performed_at": datetime.now(timezone.utc).isoformat(),
        "details": {},
    }

    if action == "extend":
        days = int(body.get("days", 30))
        if not lic:
            raise HTTPException(404, "License not found")
        now = datetime.now(timezone.utc)
        exp = _parse_dt(lic.get("expires_at"))
        base = exp if exp and exp > now else now
        new_exp = base + timedelta(days=days)
        await db.licenses.update_one(
            {"license_id": lic["license_id"]},
            {"$set": {"active": True, "expires_at": new_exp.isoformat()}},
        )
        log["details"] = {"days": days, "new_expires_at": new_exp.isoformat()}

    elif action == "cancel":
        if lic:
            await db.licenses.update_one(
                {"license_id": lic["license_id"]},
                {"$set": {"active": False}},
            )

    elif action == "regen_key":
        if not lic:
            raise HTTPException(404, "License not found")
        new_key = _generate_key()
        await db.licenses.update_one(
            {"license_id": lic["license_id"]},
            {"$set": {"key": new_key, "mac_id": None, "mac_name": None}},
        )
        log["details"] = {"new_key_prefix": new_key[:14]}

    elif action == "reset_mac":
        if lic:
            await db.licenses.update_one(
                {"license_id": lic["license_id"]},
                {"$set": {"mac_id": None, "mac_name": None}},
            )

    elif action in ("block", "unblock"):
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"is_blocked": action == "block"}},
        )
        # also kill sessions if blocked
        if action == "block":
            await db.user_sessions.delete_many({"user_id": user_id})

    elif action == "save_notes":
        notes = body.get("notes", "")
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"admin_notes": notes}},
        )
        log["details"] = {"notes_len": len(notes)}

    else:
        raise HTTPException(400, f"Unknown action: {action}")

    await db.admin_logs.insert_one(log)
    return {"ok": True}


@router.post("/generate-key")
async def admin_generate_key(body: dict, admin: dict = Depends(require_admin)):
    email = (body.get("email") or "").strip().lower()
    days = int(body.get("days", 30))
    if not email:
        raise HTTPException(400, "email required")

    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        # create stub user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": email.split("@")[0],
            "provider": "manual",
            "avatar_url": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_blocked": False,
            "admin_notes": "Manually created by admin",
        }
        await db.users.insert_one(user)

    lic = await db.licenses.find_one({"user_id": user["user_id"]}, {"_id": 0})
    now = datetime.now(timezone.utc)
    if lic:
        exp = _parse_dt(lic.get("expires_at"))
        base = exp if exp and exp > now else now
        new_exp = base + timedelta(days=days)
        new_key = _generate_key()
        await db.licenses.update_one(
            {"license_id": lic["license_id"]},
            {"$set": {
                "key": new_key,
                "active": True,
                "expires_at": new_exp.isoformat(),
                "mac_id": None,
                "mac_name": None,
            }},
        )
    else:
        new_key = _generate_key()
        new_exp = now + timedelta(days=days)
        await db.licenses.insert_one({
            "license_id": f"lic_{uuid.uuid4().hex[:12]}",
            "user_id": user["user_id"],
            "key": new_key,
            "mac_id": None,
            "mac_name": None,
            "active": True,
            "created_at": now.isoformat(),
            "expires_at": new_exp.isoformat(),
        })

    await db.admin_logs.insert_one({
        "action": "manual_generate_key",
        "target_user_id": user["user_id"],
        "target_email": email,
        "performed_by": admin["email"],
        "performed_at": now.isoformat(),
        "details": {"days": days, "key_prefix": new_key[:14]},
    })
    return {"key": new_key, "expires_at": new_exp.isoformat(), "email": email}


@router.get("/version")
async def get_version(_=Depends(require_admin)):
    cfg = await db.app_config.find_one({"_id": "atlas_version"}, {"_id": 0}) or {}
    return {
        "version": cfg.get("version", "0.9.0"),
        "url": cfg.get("url", "/downloads/atlas-latest.dmg"),
        "size_mb": cfg.get("size_mb", 1500),
        "released_at": cfg.get("released_at"),
    }


@router.post("/version/link")
async def update_version_link(body: dict, admin: dict = Depends(require_admin)):
    version = body.get("version", "").strip()
    url = body.get("url", "").strip()
    size_mb = float(body.get("size_mb") or 0.0)
    
    if not version or not url:
        raise HTTPException(400, "version and url required")
        
    import re
    drive_match = re.search(r"drive\.google\.com/file/d/([^/]+)/", url)
    if drive_match:
        file_id = drive_match.group(1)
        url = f"https://drive.google.com/uc?export=download&id={file_id}"
        
    safe = version.replace("/", "_")
    
    await db.app_config.update_one(
        {"_id": "atlas_version"},
        {"$set": {
            "version": safe,
            "url": url,
            "size_mb": round(size_mb, 1),
            "released_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    await db.admin_logs.insert_one({
        "action": "update_version_link",
        "performed_by": admin["email"],
        "performed_at": datetime.now(timezone.utc).isoformat(),
        "details": {"version": safe, "size_mb": size_mb, "url": url},
    })
    return {"version": safe, "url": url, "size_mb": size_mb}


@router.post("/version")
async def upload_version(
    version: str = Form(...),
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin),
):
    if not version.strip():
        raise HTTPException(400, "version required")
    safe = version.strip().replace("/", "_")

    # Support both .tar.gz and .dmg
    is_tar = file.filename.endswith(".tar.gz") or file.filename.endswith(".tgz")
    ext = ".tar.gz" if is_tar else ".dmg"

    # Always save as atlas-latest.dmg (for secure download endpoint)
    dest_latest = UPLOAD_DIR / "atlas-latest.dmg"
    dest_versioned = UPLOAD_DIR / f"atlas-{safe}{ext}"

    size = 0
    # Write both the versioned archive and the "latest" symlink
    with dest_versioned.open("wb") as f:
        while chunk := await file.read(1 << 20):  # 1 MB chunks
            size += len(chunk)
            f.write(chunk)

    # Copy to atlas-latest.dmg for the secure download system
    import shutil as _shutil
    _shutil.copy2(dest_versioned, dest_latest)

    size_mb = round(size / (1024 * 1024), 1)
    url = f"/downloads/atlas-{safe}{ext}"

    await db.app_config.update_one(
        {"_id": "atlas_version"},
        {"$set": {
            "version": safe,
            "url": url,
            "size_mb": size_mb,
            "released_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    await db.admin_logs.insert_one({
        "action": "upload_version",
        "performed_by": admin["email"],
        "performed_at": datetime.now(timezone.utc).isoformat(),
        "details": {"version": safe, "size_mb": size_mb, "type": ext},
    })
    return {"version": safe, "url": url, "size_mb": size_mb}



@router.get("/api-logs")
async def api_logs(_=Depends(require_admin)):
    logs = await db.api_logs.find({}, {"_id": 0}).sort("ts", -1).limit(100).to_list(100)
    # Detect suspicious activity: same key from 3+ mac_ids in last 24h OR >10 checks/hour
    suspicious_keys = set()
    by_key = {}
    now = datetime.now(timezone.utc)
    for log in logs:
        ts = _parse_dt(log.get("ts"))
        if not ts:
            continue
        kp = log.get("key_prefix")
        if not kp:
            continue
        by_key.setdefault(kp, []).append((ts, log.get("mac_id")))
    for k, entries in by_key.items():
        last_24 = [e for e in entries if (now - e[0]) <= timedelta(hours=24)]
        macs = {m for _, m in last_24 if m}
        if len(macs) >= 3:
            suspicious_keys.add(k)
        last_hour = [e for e in entries if (now - e[0]) <= timedelta(hours=1)]
        if len(last_hour) > 10:
            suspicious_keys.add(k)
    for log in logs:
        log["suspicious"] = log.get("key_prefix") in suspicious_keys
    return logs


@router.get("/admin-logs")
async def admin_logs(_=Depends(require_admin)):
    logs = await db.admin_logs.find({}, {"_id": 0}).sort("performed_at", -1).limit(200).to_list(200)
    return logs


# ── Detailed Stats and Analytics Endpoints ────────────────────────────────────

@router.get("/detailed-stats")
async def detailed_stats(_=Depends(require_admin)):
    txs = await db.payment_transactions.find({}).sort("created_at", -1).to_list(1000)
    
    stripe_count = 0
    stripe_amount = 0.0
    ton_count = 0
    ton_amount = 0.0
    
    for tx in txs:
        gateway = tx.get("payment_gateway") or ("ton" if tx.get("ton_tx_hash") or tx.get("currency") == "TON" else "stripe")
        status = tx.get("payment_status")
        amount = float(tx.get("amount") or 0.0)
        
        if status == "paid":
            if gateway == "stripe":
                stripe_count += 1
                stripe_amount += amount
            elif gateway == "ton":
                ton_count += 1
                ton_amount += amount
                
    return {
        "stripe": {"count": stripe_count, "amount": round(stripe_amount, 2)},
        "ton": {"count": ton_count, "amount": round(ton_amount, 2)},
        "transactions": txs
    }


# ── System Health Monitor Endpoints ───────────────────────────────────────────

@router.get("/health-metrics")
async def health_metrics(_=Depends(require_admin)):
    import sys
    import time
    
    cpu_percent = 1.8
    mem_used_mb = 138.4
    mem_total_mb = 8192.0
    
    try:
        import psutil
        cpu_percent = psutil.cpu_percent(interval=None)
        mem = psutil.virtual_memory()
        mem_used_mb = round(mem.used / (1024 * 1024), 1)
        mem_total_mb = round(mem.total / (1024 * 1024), 1)
    except ImportError:
        pass

    db_latency_ms = 0.0
    t0 = time.time()
    try:
        await db.app_config.find_one({"_id": "atlas_version"})
        db_latency_ms = round((time.time() - t0) * 1000, 2)
    except Exception:
        db_latency_ms = -1.0

    uptime_seconds = round(time.time() - getattr(sys, "_startup_time", t0 - 7200), 1)
    return {
        "cpu_percent": cpu_percent if cpu_percent > 0 else 1.2,
        "memory": {"used_mb": mem_used_mb, "total_mb": mem_total_mb},
        "db_latency_ms": db_latency_ms,
        "uptime_seconds": uptime_seconds if uptime_seconds > 0 else 7200.0,
        "python_version": sys.version.split(" ")[0]
    }


# ── Broadcast Alerts Endpoints ────────────────────────────────────────────────

async def send_telegram_alert(message: str):
    import httpx
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    try:
        import telegram_auth
        allowed_id = telegram_auth.get_allowed_user_id()
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        if bot_token and allowed_id:
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(url, json={"chat_id": allowed_id, "text": f"📢 [Atlas System Broadcast]\n\n{message}"})
    except Exception as e:
        logger.error("Failed to send Telegram broadcast: %s", e)


@router.post("/broadcast")
async def create_broadcast(body: dict, admin: dict = Depends(require_admin)):
    message = (body.get("message") or "").strip()
    target = (body.get("target") or "all").strip()
    
    if not message:
        raise HTTPException(status_code=400, detail="Broadcast message is empty")
        
    now_iso = datetime.now(timezone.utc).isoformat()
    broadcast_doc = {
        "message": message,
        "target": target,
        "created_by": admin["email"],
        "created_at": now_iso
    }
    
    if target in ("all", "clients"):
        await db.system_broadcasts.insert_one(broadcast_doc)
        
    if target in ("all", "telegram"):
        await send_telegram_alert(message)
            
    await db.admin_logs.insert_one({
        "action": "create_broadcast",
        "performed_by": admin["email"],
        "performed_at": now_iso,
        "details": {"target": target, "message_len": len(message)}
    })
    
    return {"ok": True}


# ── Geolocation Active Map Endpoints ──────────────────────────────────────────

async def get_ip_geo(ip: str) -> dict:
    if not ip or ip in ("127.0.0.1", "localhost", "unknown") or ip.startswith("192.168.") or ip.startswith("10."):
        # Central Ukraine default location
        return {"country": "Ukraine", "region": "Kyiv Oblast", "city": "Kyiv", "lat": 50.4501, "lon": 30.5234}

    try:
        cached = await db.ip_geo_cache.find_one({"ip": ip}, {"_id": 0})
        if cached:
            return cached
    except Exception:
        pass

    import httpx
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            r = await client.get(f"http://ip-api.com/json/{ip}")
            if r.status_code == 200:
                data = r.json()
                if data.get("status") == "success":
                    geo = {
                        "ip": ip,
                        "country": data.get("country", "Unknown"),
                        "region": data.get("regionName", "Unknown"),
                        "city": data.get("city", "Unknown"),
                        "lat": data.get("lat", 50.4501),
                        "lon": data.get("lon", 30.5234),
                        "ts": datetime.now(timezone.utc).isoformat()
                    }
                    try:
                        await db.ip_geo_cache.insert_one(geo)
                    except Exception:
                        pass
                    return geo
    except Exception as e:
        logger.error("Geo lookup error for IP %s: %s", ip, e)

    return {"country": "Unknown", "region": "Unknown", "city": "Unknown", "lat": 50.4501, "lon": 30.5234}


@router.get("/active-map")
async def get_active_map(user: dict = Depends(require_admin)):
    logs = await db.api_logs.find({}).sort("ts", -1).limit(200).to_list(200)
    seen = set()
    spots = []
    for l in logs:
        kp = l.get("key_prefix")
        if not kp or kp in seen:
            continue
        seen.add(kp)
        ip = l.get("ip") or ""
        geo = await get_ip_geo(ip)
        spots.append({
            "key_prefix": kp,
            "ip": ip,
            "country": geo.get("country", "Unknown"),
            "region": geo.get("region", "Unknown"),
            "city": geo.get("city", "Unknown"),
            "lat": geo.get("lat", 50.4501),
            "lon": geo.get("lon", 30.5234),
            "ts": l.get("ts"),
            "suspicious": bool(l.get("suspicious", False))
        })
    
    # Add active admin sessions for super admins
    if user.get("is_super_admin"):
        admin_logs = await db.admin_logs.find({"action": "admin_login"}).sort("performed_at", -1).limit(50).to_list(50)
        seen_admins = set()
        for l in admin_logs:
            email = l.get("performed_by")
            if not email or email in seen_admins:
                continue
            seen_admins.add(email)
            ip = l.get("ip") or ""
            geo = await get_ip_geo(ip)
            spots.append({
                "key_prefix": f"ADMIN:{email}",
                "ip": ip,
                "country": geo.get("country", "Unknown"),
                "region": geo.get("region", "Unknown"),
                "city": geo.get("city", "Unknown"),
                "lat": geo.get("lat", 50.4501),
                "lon": geo.get("lon", 30.5234),
                "ts": l.get("performed_at"),
                "suspicious": False,
                "is_admin_marker": True
            })

    return spots


# ── Custom Documentation CMS Endpoints ────────────────────────────────────────

@router.get("/docs/custom", tags=["docs"])
async def get_custom_docs():
    """Public endpoint to fetch all dynamic/custom documentation sections."""
    docs = await db.custom_docs.find({}).to_list(1000)
    # Sort custom docs by order index
    docs.sort(key=lambda d: int(d.get("order", 99)))
    return docs


@router.post("/docs")
async def save_custom_doc(body: dict, admin: dict = Depends(require_admin)):
    """Creates or updates a custom documentation page."""
    doc_id = body.get("id")
    if not doc_id:
        raise HTTPException(status_code=400, detail="id (slug) is required")
        
    doc_id = doc_id.strip().lower().replace(" ", "-")
    
    doc_data = {
        "id": doc_id,
        "title": body.get("title", "Untitled Section").strip(),
        "eyebrow": body.get("eyebrow", "Додатково").strip(),
        "desc": body.get("desc", "").strip(),
        "content": body.get("content", "").strip(),
        "icon": body.get("icon", "BookOpen").strip(),
        "order": int(body.get("order", 99)),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_by": admin["email"]
    }
    
    await db.custom_docs.update_one({"id": doc_id}, {"$set": doc_data}, upsert=True)
    
    await db.admin_logs.insert_one({
        "action": "save_custom_doc",
        "performed_by": admin["email"],
        "performed_at": datetime.now(timezone.utc).isoformat(),
        "details": {"doc_id": doc_id, "title": doc_data["title"]}
    })
    
    return {"ok": True, "doc": doc_data}


@router.delete("/docs/{doc_id}")
async def delete_custom_doc(doc_id: str, admin: dict = Depends(require_admin)):
    """Deletes a custom documentation page."""
    existing = await db.custom_docs.find_one({"id": doc_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Document not found")
        
    await db.custom_docs.delete_one({"id": doc_id})
    
    await db.admin_logs.insert_one({
        "action": "delete_custom_doc",
        "performed_by": admin["email"],
        "performed_at": datetime.now(timezone.utc).isoformat(),
        "details": {"doc_id": doc_id, "title": existing.get("title")}
    })
    
    return {"ok": True}


# ── Job Applications Endpoints ────────────────────────────────────────────────

@router.get("/job-applications")
async def get_job_applications(_=Depends(require_admin)):
    """Returns all job applications."""
    applications = await db.job_applications.find({}).sort("created_at", -1).to_list(1000)
    return applications


# ── Sub-Admins Management Endpoints ──────────────────────────────────────────

@router.get("/subadmins")
async def list_subadmins(_=Depends(require_super_admin)):
    users = await db.users.find({"is_admin": True}).to_list(1000)
    return [
        {
            "user_id": u["user_id"],
            "email": u["email"],
            "name": u.get("name"),
            "created_at": u.get("created_at"),
            "is_super_admin": u.get("is_super_admin", False)
        }
        for u in users if not u.get("is_super_admin")
    ]

@router.post("/subadmins")
async def create_subadmin(body: dict, _=Depends(require_super_admin)):
    email = body.get("email", "").strip().lower()
    name = body.get("name", "").strip()
    if not email or "@" not in email:
        raise HTTPException(400, "Invalid email")
    
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(400, "User with this email already exists")

    import secrets
    password = secrets.token_urlsafe(12)
    salt = secrets.token_hex(16)
    hashed = _hash_password_pbkdf2(password, salt)
    user_id = f"admin_{uuid.uuid4().hex[:12]}"

    await db.users.insert_one({
        "user_id": user_id,
        "email": email,
        "name": name or "Sub-Administrator",
        "password_hash": hashed,
        "password_salt": salt,
        "provider": "email",
        "avatar_url": "",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_blocked": False,
        "is_admin": True,
        "is_super_admin": False,
        "admin_notes": "Створено головним адміністратором"
    })
    
    return {"ok": True, "email": email, "password": password, "user_id": user_id}

@router.delete("/subadmins/{user_id}")
async def delete_subadmin(user_id: str, _=Depends(require_super_admin)):
    target = await db.users.find_one({"user_id": user_id})
    if not target or target.get("is_super_admin"):
        raise HTTPException(400, "Cannot delete this user")
    
    await db.users.delete_one({"user_id": user_id})
    # Also delete their active sessions so they are logged out immediately
    await db.user_sessions.delete_many({"user_id": user_id})
    
    return {"ok": True}


# ──────────────────────────────────────────────────────────────────────────────
# Waitlist management
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/waitlist")
async def get_waitlist(_=Depends(require_admin)):
    """Get all waitlist entries sorted by registration date."""
    entries = await db.waitlist.find({}).sort("registered_at", 1).to_list(10000)
    total = len(entries)
    approved = sum(1 for e in entries if e.get("status") == "approved")
    pending = sum(1 for e in entries if e.get("status") == "pending")
    rejected = sum(1 for e in entries if e.get("status") == "rejected")
    return {
        "total": total,
        "approved": approved,
        "pending": pending,
        "rejected": rejected,
        "entries": entries,
    }


@router.post("/waitlist/approve-all")
async def approve_all_waitlist(body: dict = {}, _=Depends(require_admin)):
    """Approve all pending waitlist entries."""
    pending_entries = await db.waitlist.find({"status": "pending"}).to_list(1000)
    now = datetime.now(timezone.utc)
    count = 0

    import secrets
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    plan_days = {"atlas_monthly": 30, "atlas_quarterly": 90, "atlas_yearly": 365, "early_access": 30}

    for entry in pending_entries:
        days = plan_days.get(entry.get("plan", "early_access"), 30)
        
        # Update waitlist status
        await db.waitlist.update_one(
            {"_id": entry["_id"]},
            {"$set": {"status": "approved", "approved_at": now.isoformat()}}
        )

        # Activate the user's license
        lic = await db.licenses.find_one({"user_id": entry["user_id"]})
        if lic:
            groups = ["".join(secrets.choice(alphabet) for _ in range(4)) for _ in range(4)]
            new_key = "ATLAS-" + "-".join(groups)

            expires = now + timedelta(days=days)
            await db.licenses.update_one(
                {"license_id": lic["license_id"]},
                {"$set": {
                    "key": lic.get("key") or new_key,
                    "active": True,
                    "expires_at": expires.isoformat(),
                    "auto_renew": False,
                    "waitlist_approved": True,
                }}
            )
        count += 1

    return {"ok": True, "approved_count": count}


@router.patch("/waitlist/{entry_id}/approve")
async def approve_waitlist_entry(entry_id: str, body: dict = {}, _=Depends(require_admin)):
    """Approve a waitlist entry and optionally activate their license."""
    entry = await db.waitlist.find_one({"_id": entry_id})
    if not entry:
        raise HTTPException(404, "Waitlist entry not found")

    now = datetime.now(timezone.utc)
    plan_days = {"atlas_monthly": 30, "atlas_quarterly": 90, "atlas_yearly": 365}
    days = plan_days.get(entry.get("plan", "atlas_monthly"), 30)

    # Update waitlist status
    await db.waitlist.update_one(
        {"_id": entry_id},
        {"$set": {"status": "approved", "approved_at": now.isoformat()}}
    )

    # Activate the user's license
    lic = await db.licenses.find_one({"user_id": entry["user_id"]})
    if lic:
        import secrets
        alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        groups = ["".join(secrets.choice(alphabet) for _ in range(4)) for _ in range(4)]
        new_key = "ATLAS-" + "-".join(groups)

        expires = now + timedelta(days=days)
        await db.licenses.update_one(
            {"license_id": lic["license_id"]},
            {"$set": {
                "key": lic.get("key") or new_key,
                "active": True,
                "expires_at": expires.isoformat(),
                "auto_renew": False,
                "waitlist_approved": True,
                "approved_at": now.isoformat(),
            }}
        )

    # Update user record
    await db.users.update_one(
        {"user_id": entry["user_id"]},
        {"$set": {"waitlist_status": "approved", "waitlist_approved_at": now.isoformat()}}
    )

    logger.info("Waitlist approved: email=%s plan=%s days=%s", entry.get("email"), entry.get("plan"), days)
    return {"ok": True, "days_granted": days, "message": f"Access granted for {days} days"}


@router.patch("/waitlist/{entry_id}/reject")
async def reject_waitlist_entry(entry_id: str, _=Depends(require_admin)):
    """Reject a waitlist entry."""
    entry = await db.waitlist.find_one({"_id": entry_id})
    if not entry:
        raise HTTPException(404, "Waitlist entry not found")

    await db.waitlist.update_one(
        {"_id": entry_id},
        {"$set": {"status": "rejected", "rejected_at": datetime.now(timezone.utc).isoformat()}}
    )
    await db.users.update_one(
        {"user_id": entry["user_id"]},
        {"$set": {"waitlist_status": "rejected"}}
    )
    return {"ok": True}


@router.delete("/waitlist/{entry_id}")
async def delete_waitlist_entry(entry_id: str, _=Depends(require_super_admin)):
    """Delete a waitlist entry (super admin only)."""
    await db.waitlist.delete_one({"_id": entry_id})
    return {"ok": True}


# ── Analytics Endpoints ───────────────────────────────────────────────────────

@router.get("/analytics/events")
async def get_analytics_events(_=Depends(require_admin)):
    """Get real-time tracking events."""
    events = await db.analytics_events.find({}).sort("created_at", -1).limit(200).to_list(200)
    return events


# ── Email Change (Admin-initiated with confirmation) ──────────────────────────

import random as _random
import os as _os

def _send_email_change_code(to_email: str, code: str, old_email: str):
    """Send confirmation code to the NEW email address."""
    body = f"""
An administrator has requested to change the email address for your Atlas AI account.

Old email: {old_email}
New email: {to_email}

Your confirmation code: {code}

This code is valid for 15 minutes.
If you did not expect this, please contact support.
    """
    logger.info(f"📧 EMAIL CHANGE CODE for {to_email}: {code}")

    resend_api_key = _os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        logger.warning(f"RESEND_API_KEY not set — email change code not sent to {to_email}")
        return

    import httpx
    from_email = _os.getenv("SMTP_FROM", "Atlas AI Support <onboarding@resend.dev>")
    payload = {
        "from": from_email,
        "to": [to_email],
        "subject": "Email Change Confirmation — Atlas AI",
        "text": body,
    }
    headers = {"Authorization": f"Bearer {resend_api_key}", "Content-Type": "application/json"}
    try:
        with httpx.Client() as client:
            resp = client.post("https://api.resend.com/emails", json=payload, headers=headers, timeout=10.0)
            if resp.status_code >= 400:
                logger.error(f"Failed to send email change code: {resp.text}")
            else:
                logger.info(f"Email change code sent to {to_email}")
    except Exception as e:
        logger.error(f"Email change send error: {e}")


@router.post("/users/{user_id}/change-email/request")
async def admin_request_email_change(user_id: str, body: dict, background_tasks: BackgroundTasks, _=Depends(require_admin)):
    """Admin requests an email change for a user. Sends confirmation code to the NEW email."""
    new_email = (body.get("new_email") or "").strip().lower()
    if not new_email or "@" not in new_email:
        raise HTTPException(status_code=400, detail="Вкажіть коректний новий email")

    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    # Check new email not taken
    existing = await db.users.find_one({"email": new_email})
    if existing and str(existing["_id"]) != user_id:
        raise HTTPException(status_code=409, detail="Цей email вже використовується")

    code = str(_random.randint(100000, 999999))
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()

    await db.users.update_one(
        {"_id": user_id},
        {"$set": {
            "pending_email_change": {
                "new_email": new_email,
                "code": code,
                "expires_at": expires_at,
            }
        }}
    )

    background_tasks.add_task(_send_email_change_code, new_email, code, user.get("email", ""))
    return {"ok": True, "message": f"Код підтвердження надіслано на {new_email}"}


@router.post("/users/{user_id}/change-email/confirm")
async def admin_confirm_email_change(user_id: str, body: dict, _=Depends(require_admin)):
    """Admin confirms the email change with the code received on the new email."""
    code = (body.get("code") or "").strip()
    if not code:
        raise HTTPException(status_code=400, detail="Введіть код підтвердження")

    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    pending = user.get("pending_email_change")
    if not pending:
        raise HTTPException(status_code=400, detail="Немає активного запиту на зміну email")

    expires_at = _parse_dt(pending.get("expires_at"))
    if expires_at and datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=400, detail="Код підтвердження прострочений")

    if pending.get("code") != code:
        raise HTTPException(status_code=400, detail="Невірний код підтвердження")

    new_email = pending["new_email"]
    old_email = user.get("email", "")

    await db.users.update_one(
        {"_id": user_id},
        {
            "$set": {"email": new_email},
            "$unset": {"pending_email_change": ""},
        }
    )

    logger.info(f"✅ Email changed by admin: {old_email} → {new_email} for user {user_id}")
    return {"ok": True, "message": f"Email змінено: {old_email} → {new_email}"}
