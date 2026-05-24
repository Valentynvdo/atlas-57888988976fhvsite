"""FastAPI server — main entry with startup/shutdown lifecycle."""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from auth import router as auth_router
from dashboard import router as dashboard_router
from billing import router as billing_router, webhook_router
from atlas import router as atlas_router
from admin import router as admin_router
from db import init_pool, close_pool, client
from support_bot import create_bot_and_dispatcher

import asyncio
_bot_instance = None
_polling_task = None

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("atlas")

app = FastAPI(
    title="Atlas AI Backend",
    docs_url=None,       # Disable default Swagger UI at /docs to allow React Router to serve custom /docs page
    redoc_url=None,      # Disable default ReDoc UI at /redoc
    openapi_url="/api/openapi.json" # Keep openapi schema accessible under API
)


@app.on_event("startup")
async def startup():
    global _bot_instance, _polling_task
    await init_pool()
    _bot, _dp = create_bot_and_dispatcher()
    if _bot and _dp:
        _bot_instance = _bot
        _polling_task = asyncio.create_task(_dp.start_polling(_bot, handle_signals=False))
        logger.info("Telegram support bot started polling")


@app.on_event("shutdown")
async def shutdown():
    global _polling_task, _bot_instance
    if _polling_task and not _polling_task.done():
        _polling_task.cancel()
        try:
            await _polling_task
        except asyncio.CancelledError:
            pass
    if _bot_instance:
        await _bot_instance.session.close()
    await close_pool()
    client.close()


@app.get("/api/health")
async def health():
    return {"ok": True}


def is_allowed_origin(origin: str) -> bool:
    if not origin:
        return False
    frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
    if frontend_url and origin.rstrip("/") == frontend_url:
        return True
    # Дозволяємо фронтенд на Render та локальні хости для розробки
    clean_origin = origin.rstrip("/")
    if clean_origin in (
        "https://atlas-xl1e.onrender.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost",
        "http://127.0.0.1",
    ):
        return True
    return False


# ── CORS middleware ─────────────────────────────────────────────────────────
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    origin = request.headers.get("origin", "")
    allowed = is_allowed_origin(origin)

    # Автоматично дозволяємо Same-Origin запити (фронтенд і бекенд на одному домені)
    if not allowed and origin:
        host = request.headers.get("host", "")
        proto = request.headers.get("x-forwarded-proto", request.url.scheme)
        if host:
            self_origin = f"{proto}://{host}".rstrip("/")
            if origin.rstrip("/") == self_origin:
                allowed = True

    if request.method == "OPTIONS":
        from fastapi.responses import Response
        r = Response()
        if allowed:
            r.headers["Access-Control-Allow-Origin"] = origin
            r.headers["Access-Control-Allow-Credentials"] = "true"
        else:
            r.headers["Access-Control-Allow-Origin"] = "null"
        r.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        r.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Session-ID, X-Admin-Pin"
        return r

    response = await call_next(request)
    if origin:
        if allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        else:
            response.headers["Access-Control-Allow-Origin"] = "null"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Session-ID, X-Admin-Pin"
    return response


# ── API Routers ─────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(billing_router)
app.include_router(webhook_router)
app.include_router(atlas_router)
app.include_router(admin_router)


# ── Shell script distribution routes ────────────────────────────────────────
SCRIPTS_DIR = ROOT_DIR / "static_scripts"
SCRIPTS_DIR.mkdir(exist_ok=True)

@app.get("/install", include_in_schema=False)
async def serve_install_script():
    """Serves the install.sh script as plain text for 'curl -fsSL .../install | bash'."""
    script_path = SCRIPTS_DIR / "install.sh"
    if not script_path.exists():
        from fastapi.responses import PlainTextResponse
        return PlainTextResponse("echo 'Atlas installer not yet deployed'", media_type="text/plain")
    from fastapi.responses import FileResponse as FR
    return FR(str(script_path), media_type="text/plain", filename="install.sh")

@app.get("/uninstall", include_in_schema=False)
async def serve_uninstall_script():
    """Serves the uninstall.sh script as plain text."""
    script_path = SCRIPTS_DIR / "uninstall.sh"
    if not script_path.exists():
        from fastapi.responses import PlainTextResponse
        return PlainTextResponse("echo 'Uninstaller not yet deployed'", media_type="text/plain")
    from fastapi.responses import FileResponse as FR
    return FR(str(script_path), media_type="text/plain", filename="uninstall.sh")


# ── File uploads / downloads ────────────────────────────────────────────────
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/downloads", StaticFiles(directory=str(UPLOAD_DIR)), name="downloads")


# ── Serve React SPA (production build) ─────────────────────────────────────
STATIC_DIR = ROOT_DIR / "static"

from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse

if STATIC_DIR.exists():
    # Mount compiled static assets (JS, CSS, images) inside /static/
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR / "static")), name="react-static")

@app.exception_handler(StarletteHTTPException)
async def custom_404_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        path = request.url.path
        if path.startswith("/api/") or path.startswith("/downloads/"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
            
        if STATIC_DIR.exists():
            rel_path = path.lstrip("/")
            # Attempt to serve root-level static files (favicon, manifest, etc.)
            if rel_path:
                file_path = STATIC_DIR / rel_path
                if file_path.exists() and file_path.is_file():
                    return FileResponse(str(file_path))
            
            # SPA Fallback: serve index.html for React Router
            index = STATIC_DIR / "index.html"
            if index.exists():
                return FileResponse(str(index))
                
    # Return default JSON for other HTTP exceptions
    return JSONResponse({"detail": str(exc.detail)}, status_code=exc.status_code)

if not STATIC_DIR.exists():
    logger.warning("React build not found at %s — running API only", STATIC_DIR)
