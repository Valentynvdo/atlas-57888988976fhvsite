"""Endpoints called by the Atlas Mac app: license validation + stats reporting."""
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Request

from db import db

router = APIRouter(prefix="/api/atlas", tags=["atlas"])


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


async def _log_request(key: str, ip: str, result: str, mac_id: Optional[str] = None) -> None:
    await db.api_logs.insert_one({
        "ts": datetime.now(timezone.utc).isoformat(),
        "endpoint": "/api/atlas/validate-key",
        "key_prefix": key[:14] if key else "",
        "key_full": key,
        "mac_id": mac_id,
        "ip": ip,
        "result": result,
    })
    # Keep table bounded: trim oldest beyond 1000
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
