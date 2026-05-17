"""Authentication: Emergent Google Auth + admin PIN gate."""
import os
import secrets
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Request, Response, Depends, Header

from db import db

logger = logging.getLogger("atlas.auth")

router = APIRouter(prefix="/api/auth", tags=["auth"])

SESSION_COOKIE = "atlas_session"
SESSION_TTL = timedelta(days=7)
EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


# ---------- helpers ----------

async def _ensure_license_for_user(user_id: str) -> None:
    """Create an inactive license skeleton for a new user (so dashboard always has one)."""
    existing = await db.licenses.find_one({"user_id": user_id}, {"_id": 0})
    if existing:
        return
    key = _generate_key()
    doc = {
        "license_id": f"lic_{uuid.uuid4().hex[:12]}",
        "user_id": user_id,
        "key": key,
        "mac_id": None,
        "mac_name": None,
        "active": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": None,
        "stripe_customer_id": None,
        "last_payment_session": None,
    }
    await db.licenses.insert_one(doc)


def _generate_key() -> str:
    """Format: ATLAS-XXXX-XXXX-XXXX-XXXX (4 groups of 4 uppercase alphanum)."""
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no confusing chars
    groups = ["".join(secrets.choice(alphabet) for _ in range(4)) for _ in range(4)]
    return "ATLAS-" + "-".join(groups)


def _admin_email() -> Optional[str]:
    e = os.getenv("ADMIN_EMAIL", "").strip().lower()
    return e or None


async def _claim_admin_if_needed(email: str) -> None:
    """If no admin set yet, the first user to sign in becomes admin (one-time)."""
    if _admin_email():
        return
    flag = await db.app_config.find_one({"_id": "admin_claimed"})
    if flag and flag.get("claimed"):
        return
    # claim
    await db.app_config.update_one(
        {"_id": "admin_claimed"},
        {"$set": {"claimed": True, "email": email.lower(), "claimed_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    logger.warning("ADMIN claimed automatically by first user: %s", email)


async def _current_admin_email() -> Optional[str]:
    fixed = _admin_email()
    if fixed:
        return fixed
    flag = await db.app_config.find_one({"_id": "admin_claimed"})
    if flag and flag.get("email"):
        return flag["email"].lower()
    return None


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=SESSION_COOKIE,
        value=token,
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )


# ---------- dependencies ----------

async def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(default=None),
) -> dict:
    """Get user from session_token cookie (or Authorization header fallback)."""
    token = request.cookies.get(SESSION_COOKIE)
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(None, 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not sess:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = sess.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    user = await db.users.find_one({"user_id": sess["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")
    return user


async def require_admin(request: Request, user: dict = Depends(get_current_user)) -> dict:
    admin_email = await _current_admin_email()
    if not admin_email or user["email"].lower() != admin_email:
        raise HTTPException(status_code=404, detail="Not found")
    # also require PIN to be unlocked recently
    pin_token = request.cookies.get("atlas_admin_pin")
    if not pin_token:
        raise HTTPException(status_code=403, detail="Admin PIN required")
    rec = await db.admin_pin_sessions.find_one({"token": pin_token}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=403, detail="Admin PIN invalid")
    expires_at = rec.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=403, detail="Admin PIN expired")
    return user


# ---------- routes ----------

@router.post("/google/session")
async def google_session_exchange(request: Request, response: Response):
    """Frontend hits this with X-Session-ID from the URL fragment after Emergent OAuth.
    REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    """
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-ID header missing")

    async with httpx.AsyncClient(timeout=15.0) as http:
        r = await http.get(EMERGENT_SESSION_URL, headers={"X-Session-ID": session_id})
    if r.status_code != 200:
        logger.warning("emergent session-data failed: %s %s", r.status_code, r.text[:200])
        raise HTTPException(status_code=401, detail="Auth provider rejected session")

    payload = r.json()
    email = (payload.get("email") or "").lower()
    name = payload.get("name") or email.split("@")[0]
    picture = payload.get("picture")
    session_token = payload.get("session_token") or secrets.token_urlsafe(32)
    if not email:
        raise HTTPException(status_code=401, detail="No email returned by provider")

    # Upsert user
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    if user_doc:
        user_id = user_doc["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "avatar_url": picture}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "provider": "google",
            "avatar_url": picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_blocked": False,
            "admin_notes": "",
        }
        await db.users.insert_one(user_doc)

    await _ensure_license_for_user(user_id)
    await _claim_admin_if_needed(email)

    # Session record
    expires = datetime.now(timezone.utc) + SESSION_TTL
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires.isoformat(),
    })
    _set_session_cookie(response, session_token)

    admin_email = await _current_admin_email()
    return {
        "user": {
            "user_id": user_id,
            "email": email,
            "name": name,
            "avatar_url": picture,
            "is_admin": bool(admin_email and email == admin_email),
        }
    }


@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    admin_email = await _current_admin_email()
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user.get("name"),
        "avatar_url": user.get("avatar_url"),
        "is_admin": bool(admin_email and user["email"].lower() == admin_email),
    }


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie(SESSION_COOKIE, path="/")
    response.delete_cookie("atlas_admin_pin", path="/")
    return {"ok": True}


# ---------- admin PIN ----------

PIN_TTL = timedelta(hours=2)
MAX_ATTEMPTS = 3
LOCKOUT = timedelta(hours=1)


@router.post("/admin/pin")
async def submit_admin_pin(
    body: dict,
    request: Request,
    response: Response,
    user: dict = Depends(get_current_user),
):
    admin_email = await _current_admin_email()
    if not admin_email or user["email"].lower() != admin_email:
        # do not reveal admin endpoint existence
        raise HTTPException(status_code=404, detail="Not found")

    ip = request.client.host if request.client else "unknown"
    # check IP lockout
    lock = await db.admin_pin_lock.find_one({"ip": ip}, {"_id": 0})
    if lock:
        until = lock.get("locked_until")
        if isinstance(until, str):
            until = datetime.fromisoformat(until)
        if until and until.tzinfo is None:
            until = until.replace(tzinfo=timezone.utc)
        if until and until > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="IP locked. Try later.")

    pin = (body.get("pin") or "").strip()
    expected = os.getenv("ADMIN_PIN", "")
    if pin != expected or not expected:
        # increment attempts
        new_attempts = (lock.get("attempts", 0) if lock else 0) + 1
        update = {"attempts": new_attempts, "last_attempt": datetime.now(timezone.utc).isoformat()}
        if new_attempts >= MAX_ATTEMPTS:
            update["locked_until"] = (datetime.now(timezone.utc) + LOCKOUT).isoformat()
            update["attempts"] = 0
        await db.admin_pin_lock.update_one({"ip": ip}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid PIN")

    # success: reset lock, issue pin session token
    await db.admin_pin_lock.delete_one({"ip": ip})
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + PIN_TTL
    await db.admin_pin_sessions.insert_one({
        "token": token,
        "user_id": user["user_id"],
        "expires_at": expires.isoformat(),
    })
    response.set_cookie(
        key="atlas_admin_pin",
        value=token,
        max_age=int(PIN_TTL.total_seconds()),
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )
    await db.admin_logs.insert_one({
        "action": "admin_login",
        "performed_by": user["email"],
        "performed_at": datetime.now(timezone.utc).isoformat(),
        "ip": ip,
    })
    return {"ok": True}


@router.get("/admin/status")
async def admin_status(user: dict = Depends(get_current_user)):
    """Return whether current user is admin and whether PIN is unlocked.

    Used by frontend to gate /x7k9m-admin UI without 404ing the page.
    """
    admin_email = await _current_admin_email()
    is_admin = bool(admin_email and user["email"].lower() == admin_email)
    return {
        "is_admin": is_admin,
        "pin_required": is_admin,
        # client checks via separate /api/admin/ping (require_admin) for full unlock
    }
