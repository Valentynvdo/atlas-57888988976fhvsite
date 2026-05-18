"""Endpoints called by the Atlas Mac app: license validation + stats reporting + secure download."""
from datetime import datetime, timezone, timedelta
from typing import Optional
import uuid
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse

from db import db

router = APIRouter(prefix="/api/atlas", tags=["atlas"])

UPLOAD_DIR = Path(__file__).parent / "uploads"


def _parse_dt(v) -> Optional[datetime]:
    if v is None:
        return None
    if isinstance(v, str):
        v = datetime.fromisoformat(v)
    if v.tzinfo is None:
        v = v.replace(tzinfo=timezone.utc)
    return v


@router.post("/validate-key")
async def validate_key(body: dict, request: Request):
    """Mac app calls this on every launch (or periodically).

    Body: {"key": "ATLAS-...", "mac_id": "abc123", "mac_name": "MacBook Pro"}
    Returns: {valid, expires_at, days_left, message}
    """
    key = (body.get("key") or "").strip().upper()
    mac_id = (body.get("mac_id") or "").strip()
    mac_name = (body.get("mac_name") or "Mac").strip()

    ip = request.client.host if request.client else "unknown"
    result_summary = "ok"
    lic = await db.licenses.find_one({"key": key}, {"_id": 0})
    if not lic:
        result_summary = "key_not_found"
        await _log_request(key, ip, result_summary)
        raise HTTPException(status_code=404, detail="Невірний ключ")

    user = await db.users.find_one({"user_id": lic["user_id"]}, {"_id": 0})
    if user and user.get("is_blocked"):
        result_summary = "blocked"
        await _log_request(key, ip, result_summary)
        raise HTTPException(status_code=403, detail="Акаунт заблоковано")

    # Bind mac_id on first activation
    if not lic.get("mac_id"):
        await db.licenses.update_one(
            {"license_id": lic["license_id"]},
            {"$set": {"mac_id": mac_id, "mac_name": mac_name}},
        )
        lic["mac_id"] = mac_id
        lic["mac_name"] = mac_name
    elif lic["mac_id"] != mac_id:
        result_summary = "wrong_mac"
        await _log_request(key, ip, result_summary, mac_id=mac_id)
        raise HTTPException(
            status_code=409,
            detail="Ключ уже активовано на іншому Mac. Перенесіть в кабінеті.",
        )

    exp = _parse_dt(lic.get("expires_at"))
    now = datetime.now(timezone.utc)
    if not lic.get("active") or not exp or exp < now:
        result_summary = "expired"
        await _log_request(key, ip, result_summary, mac_id=mac_id)
        return {
            "valid": False,
            "expires_at": exp.isoformat() if exp else None,
            "days_left": 0,
            "message": "Підписка неактивна. Поновіть у кабінеті.",
        }

    days_left = max(0, (exp - now).days)
    await _log_request(key, ip, result_summary, mac_id=mac_id)
    return {
        "valid": True,
        "expires_at": exp.isoformat(),
        "days_left": days_left,
        "message": "OK",
    }


async def get_ip_geo(ip: str) -> dict:
    if not ip or ip in ("127.0.0.1", "localhost", "unknown") or ip.startswith("192.168.") or ip.startswith("10."):
        return {"country": "Ukraine", "city": "Kyiv", "lat": 50.4501, "lon": 30.5234}
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
    except Exception:
        pass
    return {"country": "Unknown", "city": "Unknown", "lat": 50.4501, "lon": 30.5234}


def haversine_distance(lon1, lat1, lon2, lat2):
    from math import radians, cos, sin, asin, sqrt
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371.0
    return c * r


async def send_telegram_alert(message: str):
    import httpx
    try:
        import sys
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        import telegram_auth
        allowed_id = telegram_auth.get_allowed_user_id()
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        if bot_token and allowed_id:
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(url, json={"chat_id": allowed_id, "text": message})
    except Exception:
        pass


async def _log_request(key: str, ip: str, result: str, mac_id: Optional[str] = None) -> None:
    now = datetime.now(timezone.utc)
    suspicious = False
    
    try:
        prev = await db.api_logs.find({"key_full": key}).sort("ts", -1).limit(1).to_list()
        if prev:
            prev_log = prev[0]
            prev_ip = prev_log.get("ip")
            prev_ts = _parse_dt(prev_log.get("ts"))
            if prev_ip and prev_ip != ip and prev_ts:
                geo1 = await get_ip_geo(prev_ip)
                geo2 = await get_ip_geo(ip)
                
                lat1, lon1 = geo1.get("lat", 50.4501), geo1.get("lon", 30.5234)
                lat2, lon2 = geo2.get("lat", 50.4501), geo2.get("lon", 30.5234)
                
                distance = haversine_distance(lon1, lat1, lon2, lat2)
                hours_diff = (now - prev_ts).total_seconds() / 3600.0
                
                if distance > 100.0 and hours_diff > 0.0:
                    speed = distance / hours_diff
                    if speed > 900.0:
                        suspicious = True
                        alert_msg = (
                            f"🚨 [Anti-Fraud Alert] Зафіксовано спробу піратства ліцензійного ключа!\n\n"
                            f"Ключ: {key[:14]}...\n"
                            f"Час між запитами: {round(hours_diff * 60, 1)} хв\n"
                            f"Попередня локація: {geo1.get('city')}, {geo1.get('country')} (IP: {prev_ip})\n"
                            f"Нова локація: {geo2.get('city')}, {geo2.get('country')} (IP: {ip})\n"
                            f"Відстань: {round(distance, 1)} км\n"
                            f"Розрахункова швидкість: {round(speed, 1)} км/год ✈️"
                        )
                        await send_telegram_alert(alert_msg)
    except Exception:
        pass

    await db.api_logs.insert_one({
        "ts": now.isoformat(),
        "endpoint": "/api/atlas/validate-key",
        "key_prefix": key[:14] if key else "",
        "key_full": key,
        "mac_id": mac_id,
        "ip": ip,
        "result": result,
        "suspicious": suspicious
    })
    
    cnt = await db.api_logs.count_documents({})
    if cnt > 1000:
        oldest = await db.api_logs.find({}).sort("ts", 1).limit(cnt - 1000).to_list(None)
        if oldest:
            for doc in oldest:
                await db.api_logs.delete_one({"ts": doc["ts"], "key_full": doc.get("key_full", "")})


@router.post("/stats")
async def report_stats(body: dict):
    """Mac app reports usage stats periodically. Idempotent upsert."""
    key = (body.get("key") or "").strip().upper()
    mac_id = (body.get("mac_id") or "").strip()
    lic = await db.licenses.find_one({"key": key, "mac_id": mac_id}, {"_id": 0})
    if not lic:
        raise HTTPException(status_code=404, detail="License/Mac mismatch")

    update = {
        "license_id": lic["license_id"],
        "version": body.get("version", "—"),
        "days_active": int(body.get("days_active", 0) or 0),
        "skills_count": int(body.get("skills_count", 0) or 0),
        "evolutions_count": int(body.get("evolutions_count", 0) or 0),
        "requests_count": int(body.get("requests_count", 0) or 0),
        "last_evolution": body.get("last_evolution"),
        "last_check": datetime.now(timezone.utc).isoformat(),
    }
    await db.atlas_stats.update_one(
        {"license_id": lic["license_id"]},
        {"$set": update},
        upsert=True,
    )
    return {"ok": True}


@router.post("/thought")
async def post_live_thought(body: dict):
    """Atlas AI locally posts its live thoughts here."""
    thought = (body.get("thought") or "").strip()
    secret = (body.get("secret") or "").strip()
    # Simple auth to ensure only Atlas or Admin can post thoughts
    import os
    expected_secret = os.getenv("ADMIN_PASSWORD", "srv-d84mtqjtqb8s73fgcjog")
    
    if secret != expected_secret and secret != "internal_atlas_system":
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    if not thought:
        raise HTTPException(status_code=400, detail="Empty thought")
        
    await db.atlas_thoughts.insert_one({
        "thought": thought,
        "category": body.get("category", "learning"),
        "ts": datetime.now(timezone.utc).isoformat()
    })
    
    # Keep only the latest 50 thoughts to save space
    cnt = await db.atlas_thoughts.count_documents({})
    if cnt > 50:
        oldest = await db.atlas_thoughts.find({}).sort("ts", 1).limit(cnt - 50).to_list(None)
        if oldest:
            for doc in oldest:
                await db.atlas_thoughts.delete_one({"_id": doc["_id"]})
                
    return {"ok": True}


@router.get("/thought")
async def get_live_thought():
    """Returns the most recent live thought."""
    latest_list = await db.atlas_thoughts.find({}).sort("ts", -1).limit(1).to_list()
    latest = latest_list[0] if latest_list else None
    if not latest:
        return {
            "thought": "Синхронізація систем. Аналізую нові дані...",
            "ts": datetime.now(timezone.utc).isoformat(),
            "category": "system"
        }
    return {
        "thought": latest.get("thought"),
        "ts": latest.get("ts"),
        "category": latest.get("category", "learning")
    }


@router.post("/heartbeat")
async def report_heartbeat(body: dict):
    """Mac app reports live status heartbeat periodically. Idempotent upsert."""
    key = (body.get("key") or "").strip().upper()
    mac_id = (body.get("mac_id") or "").strip()
    mac_name = (body.get("mac_name") or "Mac").strip()
    version = (body.get("version") or "—").strip()
    active_skill = (body.get("active_skill") or "Idle").strip()

    if not key or not mac_id:
        raise HTTPException(status_code=400, detail="key and mac_id required")

    lic = await db.licenses.find_one({"key": key, "mac_id": mac_id}, {"_id": 0})
    if not lic:
        raise HTTPException(status_code=404, detail="License/Mac mismatch")

    now_iso = datetime.now(timezone.utc).isoformat()
    await db.app_heartbeats.update_one(
        {"license_id": lic["license_id"]},
        {"$set": {
            "user_id": lic["user_id"],
            "license_id": lic["license_id"],
            "key": key,
            "mac_id": mac_id,
            "mac_name": mac_name,
            "version": version,
            "active_skill": active_skill,
            "last_ping": now_iso,
            "status": "online"
        }},
        upsert=True
    )
    return {"ok": True}


# ── Secure Download System ────────────────────────────────────────────────────

@router.post("/download-token")
async def request_download_token(body: dict, request: Request):
    """install.sh calls this: validates license key → returns a single-use 15-min download token.

    Body: {"key": "ATLAS-..."}
    Returns: {"token": "...", "download_url": "...", "expires_in": 900}
    """
    key = (body.get("key") or "").strip().upper()
    if not key:
        raise HTTPException(status_code=400, detail="Ключ не надано")

    # Validate the license key exists and is active
    lic = await db.licenses.find_one({"key": key}, {"_id": 0})
    if not lic:
        raise HTTPException(status_code=404, detail="Невірний ключ активації")

    exp = _parse_dt(lic.get("expires_at"))
    now = datetime.now(timezone.utc)
    if not lic.get("active") or not exp or exp < now:
        raise HTTPException(status_code=403, detail="Ліцензія неактивна або закінчилась")

    # Check user is not blocked
    user = await db.users.find_one({"user_id": lic["user_id"]}, {"_id": 0})
    if user and user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Акаунт заблоковано")

    # Generate single-use token (15 minutes TTL)
    token = uuid.uuid4().hex
    token_expires = (now + timedelta(minutes=15)).isoformat()

    await db.download_tokens.insert_one({
        "token": token,
        "key": key,
        "license_id": lic["license_id"],
        "created_at": now.isoformat(),
        "expires_at": token_expires,
        "used": False,
        "ip": request.client.host if request.client else "unknown",
    })

    # Cleanup old tokens older than 30 minutes
    cutoff = (now - timedelta(minutes=30)).isoformat()
    await db.download_tokens.delete_many({"created_at": {"$lt": cutoff}})

    server_base = os.getenv("BACKEND_URL", "https://atlas-site-2p2d.onrender.com")
    return {
        "token": token,
        "download_url": f"{server_base}/api/atlas/download/{token}",
        "expires_in": 900,  # 15 minutes in seconds
    }


@router.get("/download/{token}")
async def download_atlas(token: str, request: Request):
    """Single-use download endpoint. Token is immediately invalidated after first access."""
    token_doc = await db.download_tokens.find_one({"token": token}, {"_id": 0})

    if not token_doc:
        raise HTTPException(status_code=404, detail="Токен не знайдено або вже використано")

    if token_doc.get("used"):
        raise HTTPException(status_code=403, detail="Токен вже використано. Запросіть новий.")

    now = datetime.now(timezone.utc)
    token_exp = _parse_dt(token_doc.get("expires_at"))
    if not token_exp or token_exp < now:
        await db.download_tokens.delete_one({"token": token})
        raise HTTPException(status_code=403, detail="Токен прострочено (15 хв). Запросіть новий.")

    # Immediately invalidate token (single-use)
    await db.download_tokens.update_one(
        {"token": token},
        {"$set": {"used": True, "used_at": now.isoformat(), "used_ip": request.client.host if request.client else "unknown"}}
    )

    # Find the atlas package file
    pkg_path = UPLOAD_DIR / "atlas-latest.tar.gz"
    if not pkg_path.exists():
        raise HTTPException(status_code=503, detail="Файл пакету ще не завантажено адміністратором")

    return FileResponse(
        path=str(pkg_path),
        media_type="application/gzip",
        filename="atlas-latest.tar.gz",
        headers={"Content-Disposition": "attachment; filename=atlas-latest.tar.gz"}
    )
