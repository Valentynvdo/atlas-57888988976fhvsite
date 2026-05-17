"""Admin (developer) panel — hidden at /x7k9m-admin in frontend."""
import logging
import os
import shutil
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form

from auth import require_admin, _generate_key, _current_admin_email
from db import db

logger = logging.getLogger("atlas.admin")

router = APIRouter(prefix="/api/admin", tags=["admin"])

UPLOAD_DIR = Path("/app/uploads")
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

    # Active licenses (active=true AND expires_at>now)
    active_count = 0
    inactive_count = 0
    expiring_soon = 0
    all_licenses = await db.licenses.find({}, {"_id": 0}).to_list(10000)
    for lic in all_licenses:
        exp = _parse_dt(lic.get("expires_at"))
        if lic.get("active") and exp and exp > now:
            active_count += 1
            if (exp - now).days <= 7:
                expiring_soon += 1
        else:
            inactive_count += 1

    # New users today
    users_today = await db.users.count_documents({
        "created_at": {"$gte": today.isoformat()},
    })
    total_users = await db.users.count_documents({})

    # Churn this month: licenses that expired (expires_at < now and was active in past month)
    churn = 0
    for lic in all_licenses:
        exp = _parse_dt(lic.get("expires_at"))
        if exp and month_start <= exp < now and not lic.get("active"):
            churn += 1

    # Revenue (sum of paid tx this month)
    paid_tx = await db.payment_transactions.find(
        {"payment_status": "paid", "created_at": {"$gte": month_start.isoformat()}},
        {"_id": 0, "amount": 1, "currency": 1},
    ).to_list(10000)
    monthly_revenue = round(sum((t.get("amount") or 0) for t in paid_tx), 2)
    yearly_forecast = round(monthly_revenue * 12, 2)

    # 12-month growth (count of users by month)
    growth = []
    for i in range(11, -1, -1):
        m_start = (now.replace(day=1) - timedelta(days=i * 30))
        m_start = m_start.replace(hour=0, minute=0, second=0, microsecond=0)
        m_end = m_start + timedelta(days=31)
        cnt = await db.users.count_documents({
            "created_at": {"$gte": m_start.isoformat(), "$lt": m_end.isoformat()},
        })
        growth.append({"month": m_start.strftime("%Y-%m"), "users": cnt})

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
    now = datetime.now(timezone.utc)
    out = []
    for u in users:
        lic = await db.licenses.find_one({"user_id": u["user_id"]}, {"_id": 0}) or {}
        stats = await db.atlas_stats.find_one({"license_id": lic.get("license_id")}, {"_id": 0}) or {}
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
            "version": stats.get("version", "—"),
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
        "url": cfg.get("url", "/downloads/atlas.dmg"),
        "size_mb": cfg.get("size_mb", 84),
        "released_at": cfg.get("released_at"),
    }


@router.post("/version")
async def upload_version(
    version: str = Form(...),
    file: UploadFile = File(...),
    admin: dict = Depends(require_admin),
):
    if not version.strip():
        raise HTTPException(400, "version required")
    safe = version.strip().replace("/", "_")
    dest = UPLOAD_DIR / f"atlas-{safe}.dmg"
    size = 0
    with dest.open("wb") as f:
        while chunk := await file.read(1 << 20):  # 1 MB chunks
            size += len(chunk)
            f.write(chunk)
    size_mb = round(size / (1024 * 1024), 1)

    url = f"/downloads/atlas-{safe}.dmg"
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
        "details": {"version": safe, "size_mb": size_mb},
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
