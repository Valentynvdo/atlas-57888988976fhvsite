"""User dashboard endpoints: license info, transfer, downloads, FAQ."""
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from auth import get_current_user, _generate_key
from db import db

router = APIRouter(prefix="/api", tags=["dashboard"])


def _parse_dt(v) -> Optional[datetime]:
    if v is None:
        return None
    if isinstance(v, str):
        v = datetime.fromisoformat(v)
    if v.tzinfo is None:
        v = v.replace(tzinfo=timezone.utc)
    return v


def _license_status(lic: dict) -> dict:
    now = datetime.now(timezone.utc)
    exp = _parse_dt(lic.get("expires_at"))
    if not lic.get("active") or not exp:
        return {"label": "inactive", "days_left": 0, "expires_at": None}
    delta = exp - now
    days_left = max(0, delta.days)
    if delta.total_seconds() <= 0:
        return {"label": "inactive", "days_left": 0, "expires_at": exp.isoformat()}
    label = "expiring_soon" if days_left <= 7 else "active"
    return {"label": label, "days_left": days_left, "expires_at": exp.isoformat()}


@router.get("/me/license")
async def my_license(user: dict = Depends(get_current_user)):
    lic = await db.licenses.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    stats = await db.atlas_stats.find_one({"license_id": lic["license_id"]}, {"_id": 0})
    status = _license_status(lic)
    return {
        "license_id": lic["license_id"],
        "key": lic["key"],
        "mac_id": lic.get("mac_id"),
        "mac_name": lic.get("mac_name"),
        "active": bool(lic.get("active")),
        "expires_at": status["expires_at"],
        "status": status["label"],
        "days_left": status["days_left"],
        "stats": stats or None,
    }


@router.post("/me/license/transfer")
async def transfer_license(user: dict = Depends(get_current_user)):
    """Reset mac_id so user can register the license on another Mac."""
    lic = await db.licenses.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    await db.licenses.update_one(
        {"license_id": lic["license_id"]},
        {"$set": {"mac_id": None, "mac_name": None}},
    )
    # stats reset
    await db.atlas_stats.delete_one({"license_id": lic["license_id"]})
    return {"ok": True}


@router.post("/me/cancel-renewal")
async def cancel_renewal(user: dict = Depends(get_current_user)):
    """Soft-cancel: license stays active until expires_at, but mark for non-renewal.

    This integration uses one-time payments per cycle, so cancel = remove "active" flag
    after expiry. We mark `auto_renew=false` for UI consistency.
    """
    lic = await db.licenses.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    await db.licenses.update_one(
        {"license_id": lic["license_id"]},
        {"$set": {"auto_renew": False}},
    )
    return {"ok": True, "expires_at": lic.get("expires_at")}


@router.get("/me/download")
async def download_info():
    """Public download metadata (version, URL, requirements)."""
    cfg = await db.app_config.find_one({"_id": "atlas_version"}, {"_id": 0})
    return {
        "version": (cfg or {}).get("version", "0.9.0"),
        "url": (cfg or {}).get("url", "/downloads/atlas.dmg"),
        "size_mb": (cfg or {}).get("size_mb", 84),
        "requirements": "macOS 13 Ventura або новіший. Apple Silicon або Intel. 200 MB вільного місця.",
        "released_at": (cfg or {}).get("released_at"),
    }


@router.post("/me/regenerate-key")
async def regenerate_key(user: dict = Depends(get_current_user)):
    """User-initiated key regeneration (e.g., key leaked).

    Keeps subscription status, but resets mac_id and key.
    """
    lic = await db.licenses.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not lic:
        raise HTTPException(status_code=404, detail="License not found")
    new_key = _generate_key()
    await db.licenses.update_one(
        {"license_id": lic["license_id"]},
        {"$set": {"key": new_key, "mac_id": None, "mac_name": None}},
    )
    return {"key": new_key}
