"""Waitlist: Early access registration system (replaces TON billing)."""
import logging
import os
import uuid
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request

from auth import get_current_user
from db import db

logger = logging.getLogger("atlas.billing")

router = APIRouter(prefix="/api/billing", tags=["billing"])
webhook_router = APIRouter(prefix="/api/webhook", tags=["webhook"])

# Keep packages definition for pricing display only (no actual payment)
PACKAGES = {
    "atlas_monthly":   {"amount": 28.99,  "currency": "usd", "days": 30,  "label": "Atlas AI · Monthly"},
    "atlas_quarterly": {"amount": 74.99,  "currency": "usd", "days": 90,  "label": "Atlas AI · Quarterly"},
    "atlas_yearly":    {"amount": 249.99, "currency": "usd", "days": 365, "label": "Atlas AI · Annual"},
}


# ──────────────────────────────────────────────────────────────────────────────
# Packages endpoint (used by landing page to show prices)
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/packages")
async def list_packages():
    return [{"id": k, **v} for k, v in PACKAGES.items()]


# ──────────────────────────────────────────────────────────────────────────────
# Geo detection helper
# ──────────────────────────────────────────────────────────────────────────────

async def _detect_country(ip: str) -> dict:
    """Detect country from IP using ip-api.com (free, no key required)."""
    if not ip or ip in ("127.0.0.1", "::1", "localhost"):
        return {"country": "Unknown", "country_code": "XX", "city": "Unknown"}
    try:
        async with httpx.AsyncClient(timeout=4) as client:
            r = await client.get(f"http://ip-api.com/json/{ip}?fields=country,countryCode,city,regionName")
            if r.status_code == 200:
                data = r.json()
                return {
                    "country": data.get("country", "Unknown"),
                    "country_code": data.get("countryCode", "XX"),
                    "city": data.get("city", "Unknown"),
                    "region": data.get("regionName", ""),
                }
    except Exception as e:
        logger.warning("Geo detection failed: %s", e)
    return {"country": "Unknown", "country_code": "XX", "city": "Unknown", "region": ""}


# ──────────────────────────────────────────────────────────────────────────────
# Waitlist endpoints
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/waitlist/join")
async def join_waitlist(body: dict, request: Request, user: dict = Depends(get_current_user)):
    """Register a user in the waitlist for Atlas AI early access."""
    user_id = user["user_id"]
    email = user["email"]

    # Check if already in waitlist
    existing = await db.waitlist.find_one({"user_id": user_id})
    if existing:
        # Return current position
        position = await _get_position(user_id)
        return {
            "ok": True,
            "already_registered": True,
            "position": position,
            "status": existing.get("status", "pending"),
            "registered_at": existing.get("registered_at"),
        }

    plan = body.get("plan", "atlas_monthly")
    reason = body.get("reason", "")
    name = body.get("name", user.get("name", ""))

    # Detect country from IP
    client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "").split(",")[0].strip()
    geo = await _detect_country(client_ip)

    entry_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    await db.waitlist.insert_one({
        "_id": entry_id,
        "user_id": user_id,
        "email": email,
        "name": name,
        "plan": plan,
        "reason": reason,
        "status": "pending",       # pending | approved | rejected
        "registered_at": now,
        "ip": client_ip,
        "country": geo["country"],
        "country_code": geo["country_code"],
        "city": geo["city"],
        "region": geo.get("region", ""),
    })

    # Update user record with waitlist flag
    await db.users.update_one(
        {"user_id": user_id},
        {"$set": {"in_waitlist": True, "waitlist_plan": plan, "waitlist_joined_at": now}}
    )

    position = await _get_position(user_id)

    logger.info("Waitlist: new entry email=%s position=%s plan=%s country=%s", email, position, plan, geo["country"])
    return {"ok": True, "already_registered": False, "position": position, "status": "pending", "registered_at": now}


@router.get("/waitlist/status")
async def waitlist_status(user: dict = Depends(get_current_user)):
    """Check current user's waitlist position and status."""
    user_id = user["user_id"]
    entry = await db.waitlist.find_one({"user_id": user_id})
    if not entry:
        return {"in_waitlist": False, "total": await db.waitlist.count_documents({})}

    position = await _get_position(user_id)
    total = await db.waitlist.count_documents({})
    return {
        "in_waitlist": True,
        "position": position,
        "total": total,
        "status": entry.get("status", "pending"),
        "plan": entry.get("plan", "atlas_monthly"),
        "registered_at": entry.get("registered_at"),
        "country": entry.get("country", "Unknown"),
    }


async def _get_position(user_id: str) -> int:
    """Get the user's 1-based position in the waitlist (ordered by registration time)."""
    all_entries = await db.waitlist.find({}).sort("registered_at", 1).to_list(10000)
    for i, entry in enumerate(all_entries, 1):
        if entry.get("user_id") == user_id:
            return i
    return 0


# ──────────────────────────────────────────────────────────────────────────────
# Stripe stub (kept for compatibility, non-functional)
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/checkout")
async def create_checkout(body: dict, request: Request, user: dict = Depends(get_current_user)):
    return {"url": f"{request.base_url}dashboard", "session_id": "stub_session"}


@router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, user: dict = Depends(get_current_user)):
    return {"status": "complete", "payment_status": "pending", "amount_total": 0, "currency": "usd"}


@webhook_router.post("/stripe")
async def stripe_webhook(request: Request):
    return {"received": True}
