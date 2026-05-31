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
        httponly=True, secure=True, samesite="lax", path="/",
    )


async def _ensure_license(user_id: str) -> None:
    existing = await db.licenses.find_one({"user_id": user_id})
    if existing:
        return
    await db.licenses.insert_one({
        "license_id": f"lic_{uuid.uuid4().hex[:12]}",
        "user_id": user_id, "key": None,
        "mac_id": None, "mac_name": None,
        "active": False, "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": None, "stripe_customer_id": None,
        "last_payment_session": None, "ton_tx_hash": None,
    })


async def _admin_email() -> Optional[str]:
    email = os.getenv("ADMIN_EMAIL", "admin@atlas.com").strip().lower()
    if not email or "your_admin_email" in email or email == "placeholder":
        return "admin@atlas.com"
    return email


# ──────────────────────────────────────────────────────────────────────────────
# Dependencies
# ──────────────────────────────────────────────────────────────────────────────

async def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(default=None),
) -> dict:
    token = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(None, 1)[1].strip()
    if not token:
        token = request.cookies.get(SESSION_COOKIE)
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
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin required")
        
    # Subadmins bypass the PIN check completely
    if not user.get("is_super_admin"):
        return user
        
    pin_token = request.headers.get("X-Admin-Pin") or request.cookies.get("atlas_admin_pin")
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

async def require_super_admin(request: Request, user: dict = Depends(require_admin)) -> dict:
    if not user.get("is_super_admin"):
        raise HTTPException(status_code=403, detail="Super Admin required")
    return user
import hashlib
import binascii

def _hash_password_pbkdf2(password: str, salt: str) -> str:
    hash_bytes = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        150000
    )
    return "pbkdf2_sha256$150000$" + binascii.hexlify(hash_bytes).decode('utf-8')

def _hash_password_sha256(password: str, salt: str) -> str:
    return hashlib.sha256((password + salt).encode()).hexdigest()

def _verify_and_migrate_password(password: str, salt: str, stored_hash: str) -> tuple:
    """Повертає (is_valid, needs_migrate)."""
    if not stored_hash:
        return False, False
    if stored_hash.startswith("pbkdf2_sha256$"):
        expected = _hash_password_pbkdf2(password, salt)
        return expected == stored_hash, False
    expected_old = _hash_password_sha256(password, salt)
    if expected_old == stored_hash:
        return True, True
    return False, False


# ──────────────────────────────────────────────────────────────────────────────
# Email/Password Authentication
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/register")
async def register(body: dict, response: Response):
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    name = (body.get("name") or "").strip()
    invite_code = (body.get("invite_code") or "").strip()

    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Некоректний email")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Пароль має бути не менше 6 символів")

    admin_email_fixed = os.getenv("ADMIN_EMAIL", "admin@atlas.com").strip().lower()
    if email == admin_email_fixed or email == "admin":
        raise HTTPException(status_code=400, detail="Цей email зарезервований для адміністратора")

    if invite_code:
        # Check if the invite code matches a user_id prefix
        inviter = await db.users.find_one({"user_id": {"$regex": f"^{invite_code}"}})
        if not inviter:
            raise HTTPException(status_code=400, detail="Недійсний реферальний код")
        if inviter.get("invite_used"):
            raise HTTPException(status_code=400, detail="Цей реферальний код вже було використано")

    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Користувач з таким email вже існує")

    salt = secrets.token_hex(16)
    hashed = _hash_password_pbkdf2(password, salt)
    user_id = f"user_{uuid.uuid4().hex[:12]}"

    await db.users.insert_one({
        "user_id": user_id,
        "email": email,
        "name": name or email.split("@")[0],
        "password_hash": hashed,
        "password_salt": salt,
        "provider": "email",
        "avatar_url": "",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_blocked": False,
        "admin_notes": "",
        "invited_by": invite_code,
        "invite_used": False,  # This new user can also invite exactly 1 person
    })

    if invite_code and inviter:
        # Mark the inviter's code as used
        await db.users.update_one(
            {"user_id": inviter["user_id"]},
            {"$set": {"invite_used": True}}
        )

    await _ensure_license(user_id)

    # Create session
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + SESSION_TTL
    await db.user_sessions.insert_one({
        "session_token": token, "user_id": user_id, "email": email,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires.isoformat(),
    })

    _set_session_cookie(response, token)
    return {"ok": True, "token": token, "user": {"user_id": user_id, "email": email, "name": name or email.split("@")[0]}}


@router.post("/login")
async def login(body: dict, response: Response):
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        raise HTTPException(status_code=400, detail="Заповніть всі поля")

    admin_email_fixed = os.getenv("ADMIN_EMAIL", "admin@atlas.com").strip().lower()
    if not admin_email_fixed or "your_admin_email" in admin_email_fixed or admin_email_fixed == "placeholder":
        admin_email_fixed = "admin@atlas.com"
    admin_password_fixed = os.getenv("ADMIN_PASSWORD", "").strip()
    if not admin_password_fixed or "your_secure_admin" in admin_password_fixed.lower():
        admin_password_fixed = ""

    # Predefined Admin Login (must be a valid configured email containing '@')
    if admin_email_fixed and "@" in admin_email_fixed and email == admin_email_fixed:
        user_id = "admin_user"
        admin_verified = False
        
        # 1. Check environment variables (secure compare, min 8 chars password)
        if admin_password_fixed and len(admin_password_fixed) >= 8:
            if secrets.compare_digest(password, admin_password_fixed):
                admin_verified = True
            
            # Upsert/save hashed password to DB to ensure it works even if env variable is cleared
            salt = secrets.token_hex(16)
            hashed = _hash_password_pbkdf2(password, salt)
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "email": admin_email_fixed,
                    "name": "Адміністратор",
                    "password_hash": hashed,
                    "password_salt": salt,
                    "provider": "email",
                    "avatar_url": "",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "is_blocked": False,
                    "is_admin": True,
                    "is_super_admin": True,
                    "admin_notes": "Превизначений акаунт адміністратора"
                }},
                upsert=True
            )
        else:
            # 2. Check secure hash in DB
            existing_admin = await db.users.find_one({"user_id": user_id})
            if existing_admin:
                salt = existing_admin.get("password_salt")
                stored_hash = existing_admin.get("password_hash")
                if salt and stored_hash:
                    is_valid, needs_migrate = _verify_and_migrate_password(password, salt, stored_hash)
                    if is_valid:
                        admin_verified = True
                        if needs_migrate:
                            new_hash = _hash_password_pbkdf2(password, salt)
                            await db.users.update_one(
                                {"user_id": user_id},
                                {"$set": {"password_hash": new_hash}}
                            )
        
        if not admin_verified:
            raise HTTPException(status_code=401, detail="Невірний email або пароль")
        
        # Ensure Admin User exists in DB if logged in via env without DB record
        existing_admin = await db.users.find_one({"user_id": user_id})
        if not existing_admin:
            salt = secrets.token_hex(16)
            hashed = _hash_password_pbkdf2(password, salt)
            await db.users.insert_one({
                "user_id": user_id,
                "email": admin_email_fixed,
                "name": "Адміністратор",
                "password_hash": hashed,
                "password_salt": salt,
                "provider": "email",
                "avatar_url": "",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "is_blocked": False,
                "is_admin": True,
                "is_super_admin": True,
                "admin_notes": "Превизначений акаунт адміністратора"
            })
        
        await _ensure_license(user_id)

        # Create session
        token = secrets.token_urlsafe(32)
        expires = datetime.now(timezone.utc) + SESSION_TTL
        await db.user_sessions.insert_one({
            "session_token": token, "user_id": user_id, "email": admin_email_fixed,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": expires.isoformat(),
        })

        # Auto-authorize admin PIN session to bypass secondary prompt
        pin_token = secrets.token_urlsafe(32)
        pin_expires = datetime.now(timezone.utc) + PIN_TTL
        await db.admin_pin_sessions.insert_one({
            "token": pin_token,
            "user_id": user_id,
            "expires_at": pin_expires.isoformat()
        })

        _set_session_cookie(response, token)
        response.set_cookie(
            key="atlas_admin_pin", value=pin_token,
            max_age=int(PIN_TTL.total_seconds()),
            httponly=True, secure=True, samesite="lax", path="/"
        )

        return {"ok": True, "token": token, "pin_token": pin_token, "user": {"user_id": user_id, "email": admin_email_fixed, "name": "Адміністратор", "is_admin": True, "is_super_admin": True}}

    # Regular User Login
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Невірний email або пароль")

    if user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Акаунт заблоковано")

    # Verify password
    salt = user.get("password_salt")
    stored_hash = user.get("password_hash")
    if not salt or not stored_hash:
        raise HTTPException(status_code=401, detail="Невірний email або пароль")

    is_valid, needs_migrate = _verify_and_migrate_password(password, salt, stored_hash)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Невірний email або пароль")

    if needs_migrate:
        new_hash = _hash_password_pbkdf2(password, salt)
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"password_hash": new_hash}}
        )

    # Create session
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + SESSION_TTL
    await db.user_sessions.insert_one({
        "session_token": token, "user_id": user["user_id"], "email": email,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires.isoformat(),
    })

    _set_session_cookie(response, token)
    
    pin_token = None
    if user.get("is_admin"):
        pin_token = secrets.token_urlsafe(32)
        pin_expires = datetime.now(timezone.utc) + PIN_TTL
        await db.admin_pin_sessions.insert_one({
            "token": pin_token,
            "user_id": user["user_id"],
            "expires_at": pin_expires.isoformat()
        })
        response.set_cookie(
            key="atlas_admin_pin", value=pin_token,
            max_age=int(PIN_TTL.total_seconds()),
            httponly=True, secure=True, samesite="lax", path="/"
        )
        
    return {"ok": True, "token": token, "pin_token": pin_token, "user": {"user_id": user["user_id"], "email": email, "name": user.get("name"), "is_admin": user.get("is_admin", False), "is_super_admin": user.get("is_super_admin", False)}}


# ──────────────────────────────────────────────────────────────────────────────
# Password Reset
# ──────────────────────────────────────────────────────────────────────────────
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import BackgroundTasks
import random

def _send_reset_email_sync(to_email: str, reset_code: str):
    body = f"""
You have requested to reset your password for your Atlas AI account.

Your password reset code is: {reset_code}

This code is valid for 15 minutes.
If you did not request this, please ignore this message.
    """

    # Always log the code before sending (useful if SMTP fails, e.g. on Render Free tier)
    logger.info(f"🔑 RESET CODE FOR {to_email}: {reset_code} 🔑")

    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        logger.warning(f"RESEND_API_KEY not configured. Would have sent reset code {reset_code} to {to_email}")
        return

    import httpx

    # If SMTP_FROM is not set, use onboarding@resend.dev (Resend's testing email for free accounts)
    from_email = os.getenv("SMTP_FROM", "Atlas AI Support <onboarding@resend.dev>")

    payload = {
        "from": from_email,
        "to": [to_email],
        "subject": "Password Reset - Atlas AI",
        "text": body
    }

    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json"
    }

    try:
        # Use a synchronous HTTP client since this is run in BackgroundTasks which might be async/sync
        with httpx.Client() as client:
            resp = client.post("https://api.resend.com/emails", json=payload, headers=headers, timeout=10.0)
            if resp.status_code >= 400:
                logger.error(f"Failed to send reset email via Resend: {resp.text}")
            else:
                logger.info(f"Reset email sent successfully to {to_email} via Resend")
    except Exception as e:
        logger.error(f"Failed to send reset email via Resend API: {e}")

@router.post("/forgot-password")
async def forgot_password(body: dict, background_tasks: BackgroundTasks):
    email = (body.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Введіть email")
    
    user = await db.users.find_one({"email": email})
    if not user:
        # Don't leak user existence
        return {"ok": True, "message": "Якщо email існує, інструкції надіслані."}
    
    code = f"{random.randint(100000, 999999)}"
    expires = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    await db.password_resets.update_one(
        {"email": email},
        {"$set": {"code": code, "expires_at": expires.isoformat()}},
        upsert=True
    )
    
    background_tasks.add_task(_send_reset_email_sync, email, code)
    
    return {"ok": True, "message": "Інструкції надіслані."}


@router.post("/reset-password")
async def reset_password(body: dict):
    email = (body.get("email") or "").strip().lower()
    code = (body.get("code") or "").strip()
    new_password = body.get("new_password") or ""

    if not email or not code or not new_password:
        raise HTTPException(status_code=400, detail="Всі поля обов'язкові")
    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Мінімум 6 символів")

    reset_doc = await db.password_resets.find_one({"email": email, "code": code})
    if not reset_doc:
        raise HTTPException(status_code=400, detail="Невірний код відновлення")
    
    expires_at = reset_doc.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Код закінчився")

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    salt = secrets.token_hex(16)
    hashed = _hash_password_pbkdf2(new_password, salt)

    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"password_hash": hashed, "password_salt": salt}}
    )
    
    await db.password_resets.delete_one({"_id": reset_doc["_id"]})
    return {"ok": True}


# ──────────────────────────────────────────────────────────────────────────────
# Dev-login (local testing)
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/dev-login")
async def dev_login(body: dict, response: Response):
    if os.getenv("ENV") != "development":
        raise HTTPException(status_code=403, detail="Доступ заборонено в робочому середовищі")
    role = body.get("role", "user")
    if role == "admin":
        user_id, email, name = "admin_local", "admin@atlas.com", "Адміністратор"
    else:
        user_id, email, name = "user_local", "user@atlas.com", "Звичайний Користувач"

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
        "is_admin": bool(admin_email and user["email"].lower() == admin_email) or user.get("is_admin", False),
        "is_super_admin": bool(admin_email and user["email"].lower() == admin_email) or user.get("is_super_admin", False),
        "invited_by": user.get("invited_by"),
    }


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie(SESSION_COOKIE, path="/")
    response.delete_cookie("atlas_admin_pin", path="/")
    return {"ok": True}


@router.post("/me/change-password")
async def change_password(body: dict, user: dict = Depends(get_current_user)):
    current_password = body.get("current_password") or ""
    new_password = body.get("new_password") or ""

    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Новий пароль має бути не менше 6 символів")

    db_user = await db.users.find_one({"user_id": user["user_id"]})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    salt = db_user.get("password_salt")
    stored_hash = db_user.get("password_hash")
    
    if not salt or not stored_hash:
        raise HTTPException(status_code=400, detail="Акаунт не має встановленого пароля (можливо авторизація через Google)")

    is_valid, _ = _verify_and_migrate_password(current_password, salt, stored_hash)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Невірний поточний пароль")

    new_salt = secrets.token_hex(16)
    new_hash = _hash_password_pbkdf2(new_password, new_salt)

    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"password_hash": new_hash, "password_salt": new_salt}}
    )

    return {"ok": True, "message": "Пароль успішно змінено"}


@router.get("/me/atlas-stats")
async def get_atlas_stats(user: dict = Depends(get_current_user)):
    # First, get the user's license
    lic = await db.licenses.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not lic:
        return {}
    
    stats = await db.atlas_stats.find_one({"license_id": lic["license_id"]}, {"_id": 0})
    if not stats:
        return {}
    
    return stats


# ──────────────────────────────────────────────────────────────────────────────
# Admin PIN
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/admin/pin")
async def submit_admin_pin(body: dict, request: Request, response: Response, user: dict = Depends(get_current_user)):
    if not user.get("is_super_admin"):
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
    expected = os.getenv("ADMIN_PIN", "").strip()
    if len(expected) < 4:
        expected = ""
    
    pin_verified = False
    if expected and pin == expected:
        pin_verified = True
    else:
        # Fallback to checking against database admin_user hash
        admin = await db.users.find_one({"user_id": "admin_user"})
        if admin:
            salt = admin.get("password_salt")
            stored_hash = admin.get("password_hash")
            if salt and stored_hash:
                is_valid, needs_migrate = _verify_and_migrate_password(pin, salt, stored_hash)
                if is_valid:
                    pin_verified = True
                    if needs_migrate:
                        new_hash = _hash_password_pbkdf2(pin, salt)
                        await db.users.update_one(
                            {"user_id": "admin_user"},
                            {"$set": {"password_hash": new_hash}}
                        )
                
    if not pin_verified:
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
    response.set_cookie(key="atlas_admin_pin", value=token, max_age=int(PIN_TTL.total_seconds()), httponly=True, secure=True, samesite="lax", path="/")
    await db.admin_logs.insert_one({"action": "admin_login", "performed_by": user["email"], "performed_at": datetime.now(timezone.utc).isoformat(), "ip": ip})
    return {"ok": True, "pin_token": token}


@router.get("/admin/status")
async def admin_status(user: dict = Depends(get_current_user)):
    admin_email = await _admin_email()
    return {"is_admin": bool(admin_email and user["email"].lower() == admin_email), "pin_required": True}
