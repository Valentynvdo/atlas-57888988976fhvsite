"""Authentication: Google OAuth + dev-login fallback + admin PIN."""
import logging
import os
import secrets
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException, Request, Response, Depends, Header

from db import db

logger = logging.getLogger("atlas.auth")

router = APIRouter(prefix="/api/auth", tags=["auth"])

SESSION_COOKIE = "atlas_session"
SESSION_TTL = timedelta(days=7)
PIN_TTL = timedelta(hours=2)
MAX_ATTEMPTS = 3
LOCKOUT = timedelta(hours=1)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "")


def _google_redirect_uri(request: Request) -> str:
    if BACKEND_URL:
        return f"{BACKEND_URL}/api/auth/google/callback"
    # Auto-detect from request host
    scheme = "https" if request.url.scheme == "https" or "onrender.com" in str(request.url.hostname or "") else "http"
    return f"{scheme}://{request.url.hostname}/api/auth/google/callback"


def _generate_key() -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    groups = ["".join(secrets.choice(alphabet) for _ in range(4)) for _ in range(4)]
    return "ATLAS-" + "-".join(groups)


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=SESSION_COOKIE, value=token,
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True, secure=True, samesite="none", path="/",
    )


async def _ensure_license(user_id: str) -> None:
    existing = await db.licenses.find_one({"user_id": user_id})
    if existing:
        return
    key = _generate_key()
    await db.licenses.insert_one({
        "license_id": f"lic_{uuid.uuid4().hex[:12]}",
        "user_id": user_id, "key": key,
        "mac_id": None, "mac_name": None,
        "active": False, "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": None, "stripe_customer_id": None,
        "last_payment_session": None, "ton_tx_hash": None,
    })


async def _admin_email() -> Optional[str]:
    fixed = os.getenv("ADMIN_EMAIL", "").strip().lower()
    if fixed:
        return fixed
    flag = await db.app_config.find_one({"_id": "admin_claimed"})
    if flag and flag.get("email"):
        return flag["email"].lower()
    return None


# ──────────────────────────────────────────────────────────────────────────────
# Dependencies
# ──────────────────────────────────────────────────────────────────────────────

async def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(default=None),
) -> dict:
    token = request.cookies.get(SESSION_COOKIE)
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(None, 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    sess = await db.user_sessions.find_one({"session_token": token})
    if not sess:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = sess.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    user = await db.users.find_one({"user_id": sess["user_id"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")
    return user


async def require_admin(request: Request, user: dict = Depends(get_current_user)) -> dict:
    admin_email = await _admin_email()
    if not admin_email or user["email"].lower() != admin_email:
        raise HTTPException(status_code=404, detail="Not found")
    pin_token = request.cookies.get("atlas_admin_pin")
    if not pin_token:
        raise HTTPException(status_code=403, detail="Admin PIN required")
    rec = await db.admin_pin_sessions.find_one({"token": pin_token})
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


# ──────────────────────────────────────────────────────────────────────────────
# Google OAuth
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/google/login")
async def google_login(request: Request):
    """Redirect to Google OAuth consent screen."""
    from fastapi.responses import RedirectResponse
    redirect_uri = _google_redirect_uri(request)
    params = urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str, request: Request, response: Response):
    """Exchange Google code → user profile → session."""
    from fastapi.responses import RedirectResponse

    redirect_uri = _google_redirect_uri(request)
    # Exchange code for tokens
    async with httpx.AsyncClient() as client_http:
        token_resp = await client_http.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code, "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri, "grant_type": "authorization_code",
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Google token exchange failed")
        tokens = token_resp.json()
        access_token = tokens.get("access_token")

        # Get user info
        info_resp = await client_http.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if info_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Google userinfo failed")
        guser = info_resp.json()

    email = (guser.get("email") or "").lower()
    name = guser.get("name") or email.split("@")[0]
    picture = guser.get("picture") or ""
    google_id = guser.get("id") or ""

    # Upsert user
    existing = await db.users.find_one({"email": email})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "avatar_url": picture}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": name,
            "provider": "google", "avatar_url": picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_blocked": False, "admin_notes": "",
        })
        # Claim first user as admin if no admin set
        admin_email = await _admin_email()
        if not admin_email:
            await db.app_config.update_one(
                {"_id": "admin_claimed"},
                {"$set": {"claimed": True, "email": email}},
                upsert=True,
            )
            logger.warning("Admin auto-claimed by first user: %s", email)

    await _ensure_license(user_id)

    # Create session
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + SESSION_TTL
    await db.user_sessions.insert_one({
        "session_token": token, "user_id": user_id, "email": email,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires.isoformat(),
    })

    redirect = RedirectResponse(url=f"{FRONTEND_URL}/dashboard", status_code=302)
    redirect.set_cookie(
        key=SESSION_COOKIE, value=token,
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True, secure=True, samesite="none", path="/",
    )
    return redirect


# ──────────────────────────────────────────────────────────────────────────────
# Dev-login (local testing)
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/dev-login")
async def dev_login(body: dict, response: Response):
    role = body.get("role", "user")
    if role == "admin":
        user_id, email, name = "admin_local", "admin@atlas-ai.com", "Адміністратор"
    else:
        user_id, email, name = "user_local", "user@atlas-ai.com", "Звичайний Користувач"

    # Ensure user exists
    existing = await db.users.find_one({"user_id": user_id})
    if not existing:
        await db.users.insert_one({
            "user_id": user_id, "email": email, "name": name,
            "provider": "dev", "avatar_url": "",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_blocked": False, "is_admin": role == "admin",
        })
        if role == "admin":
            await db.app_config.update_one(
                {"_id": "admin_claimed"},
                {"$set": {"claimed": True, "email": email}},
                upsert=True,
            )
    await _ensure_license(user_id)

    token = f"dev_{'admin' if role == 'admin' else 'user'}_{secrets.token_hex(8)}"
    expires = datetime.now(timezone.utc) + SESSION_TTL
    await db.user_sessions.insert_one({
        "session_token": token, "user_id": user_id, "email": email,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires.isoformat(),
    })
    _set_session_cookie(response, token)
    return {"user": {"user_id": user_id, "email": email, "name": name, "avatar_url": "", "is_admin": role == "admin"}, "token": token}


@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    admin_email = await _admin_email()
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


# ──────────────────────────────────────────────────────────────────────────────
# Admin PIN
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/admin/pin")
async def submit_admin_pin(body: dict, request: Request, response: Response, user: dict = Depends(get_current_user)):
    admin_email = await _admin_email()
    if not admin_email or user["email"].lower() != admin_email:
        raise HTTPException(status_code=404, detail="Not found")
    ip = (request.client.host if request.client else "unknown")
    lock = await db.admin_pin_lock.find_one({"ip": ip})
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
        new_attempts = (lock.get("attempts", 0) if lock else 0) + 1
        update = {"attempts": new_attempts, "last_attempt": datetime.now(timezone.utc).isoformat()}
        if new_attempts >= MAX_ATTEMPTS:
            update["locked_until"] = (datetime.now(timezone.utc) + LOCKOUT).isoformat()
            update["attempts"] = 0
        await db.admin_pin_lock.update_one({"ip": ip}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid PIN")
    await db.admin_pin_lock.delete_one({"ip": ip})
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + PIN_TTL
    await db.admin_pin_sessions.insert_one({"token": token, "user_id": user["user_id"], "expires_at": expires.isoformat()})
    response.set_cookie(key="atlas_admin_pin", value=token, max_age=int(PIN_TTL.total_seconds()), httponly=True, secure=True, samesite="none", path="/")
    await db.admin_logs.insert_one({"action": "admin_login", "performed_by": user["email"], "performed_at": datetime.now(timezone.utc).isoformat(), "ip": ip})
    return {"ok": True}


@router.get("/admin/status")
async def admin_status(user: dict = Depends(get_current_user)):
    admin_email = await _admin_email()
    return {"is_admin": bool(admin_email and user["email"].lower() == admin_email), "pin_required": True}
