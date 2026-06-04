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
from careers import router as careers_router
from analytics import router as analytics_router
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
    # Дозволяємо всі відомі фронтенд-хости та локальні хости для розробки
    clean_origin = origin.rstrip("/")
    if clean_origin in (
        "https://atlas-assistant.online",
        "https://www.atlas-assistant.online",
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
        r.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        r.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Session-ID, X-Admin-Pin"
        r.headers["Access-Control-Max-Age"] = "86400"
        return r

    response = await call_next(request)
    if origin:
        if allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        else:
            response.headers["Access-Control-Allow-Origin"] = "null"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Session-ID, X-Admin-Pin"
    return response


# ── API Routers ─────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(billing_router)
app.include_router(webhook_router)
app.include_router(atlas_router)
app.include_router(admin_router)
app.include_router(careers_router)
app.include_router(analytics_router)


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
from fastapi.responses import JSONResponse, HTMLResponse

if STATIC_DIR.exists():
    # Mount compiled static assets (JS, CSS, images) inside /static/
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR / "static")), name="react-static")


# ── SEO Meta definitions per page ───────────────────────────────────────────
# These replace the generic og:title/og:description in the single index.html
# so that Telegram/Slack/Twitter bots see the correct preview for each URL.

SEO_META = {
    # Ukrainian pages
    "/": {
        "lang": "uk",
        "title": "Atlas AI — Автономний ШІ Асистент для macOS | Завантажити безкоштовно",
        "description": "Atlas AI — персональний ШІ-асистент для macOS. Автоматизуйте задачі, керуйте файлами та програмами голосом. Автономний штучний інтелект нового покоління. Завантажте безкоштовно.",
        "url": "https://atlas-assistant.online/",
    },
    "/blog": {
        "lang": "uk",
        "title": "Блог Atlas AI — Штучний Інтелект, Автоматизація та macOS",
        "description": "Статті та інсайти від команди Atlas AI: автономні ШІ-агенти, локальні LLM, автоматизація macOS, Python, Swift. Читайте про майбутнє штучного інтелекту.",
        "url": "https://atlas-assistant.online/blog",
    },
    "/docs": {
        "lang": "uk",
        "title": "Документація Atlas AI — Встановлення та Налаштування ШІ на macOS",
        "description": "Офіційна документація Atlas AI. Покрокова інструкція з встановлення ШІ-асистента на macOS, налаштування локальної LLM, голосового керування та Telegram-бота.",
        "url": "https://atlas-assistant.online/docs",
    },
    "/careers": {
        "lang": "uk",
        "title": "Вакансії в Atlas AI — Робота для Python, Swift та ML Розробників",
        "description": "Шукаємо Python-розробників, Swift-інженерів та ML-спеціалістів до команди Atlas AI. Дистанційна робота, стартап зі штучного інтелекту для macOS. Подай заявку зараз.",
        "url": "https://atlas-assistant.online/careers",
    },
    "/investors": {
        "lang": "uk",
        "title": "Інвестиції в Atlas AI — ШІ-стартап для macOS | Deck та Контакти",
        "description": "Інвестуйте у Atlas AI — стартап у сфері автономного штучного інтелекту для macOS. Зростаюча база користувачів, унікальна технологія локального ШІ-агента. Зв'яжіться з нами.",
        "url": "https://atlas-assistant.online/investors",
    },
    # English pages
    "/en": {
        "lang": "en",
        "title": "Atlas AI — Autonomous AI Assistant for macOS | Free Download",
        "description": "Atlas AI is a personal AI assistant for macOS. Automate tasks, control apps and files with voice or text. Local AI agent — private, fast, always available. Download free.",
        "url": "https://atlas-assistant.online/en",
    },
    "/en/blog": {
        "lang": "en",
        "title": "Atlas AI Blog — AI Automation, Local LLMs & macOS Tips",
        "description": "Articles and insights from the Atlas AI team: autonomous AI agents, local LLMs, macOS automation, Python, Swift development. Stay ahead of the AI curve.",
        "url": "https://atlas-assistant.online/en/blog",
    },
    "/en/docs": {
        "lang": "en",
        "title": "Atlas AI Docs — Install & Configure Your AI Assistant on macOS",
        "description": "Official Atlas AI documentation. Step-by-step guides to install the AI assistant on macOS, set up local LLM, voice control, Telegram bot integration and more.",
        "url": "https://atlas-assistant.online/en/docs",
    },
    "/en/careers": {
        "lang": "en",
        "title": "Jobs at Atlas AI — Python, Swift & ML Engineer Roles | Remote",
        "description": "We're hiring Python developers, Swift engineers and ML specialists at Atlas AI. Remote-friendly AI startup building the future of autonomous macOS agents. Apply now.",
        "url": "https://atlas-assistant.online/en/careers",
    },
    "/en/investors": {
        "lang": "en",
        "title": "Invest in Atlas AI — AI Startup for macOS | Deck & Contact",
        "description": "Atlas AI is an autonomous AI agent startup for macOS with a growing user base and unique local AI technology. Review our pitch deck and get in touch with the founding team.",
        "url": "https://atlas-assistant.online/en/investors",
    },
}

OG_IMAGE = "https://atlas-assistant.online/og-image.jpg"


def build_seo_html(path: str) -> str | None:
    """Read index.html and inject page-specific meta tags. Returns None if index.html not found."""
    index_path = STATIC_DIR / "index.html"
    if not index_path.exists():
        return None

    # Normalise path: strip trailing slash, collapse /en/blog/some-slug -> /en/blog
    norm = path.rstrip("/") or "/"

    # Try exact match first, then match by prefix (for slug sub-pages like /blog/my-post)
    meta = SEO_META.get(norm)
    if meta is None:
        parts = norm.split("/")  # e.g. ['', 'blog', 'my-post']
        # Try /section or /en/section
        if len(parts) >= 3 and parts[1] == "en":
            meta = SEO_META.get("/en/" + parts[2])
        elif len(parts) >= 2:
            meta = SEO_META.get("/" + parts[1])

    # Fall back to homepage meta if no match
    if meta is None:
        lang = "en" if norm.startswith("/en") else "uk"
        meta = SEO_META.get("/en" if lang == "en" else "/")

    html = index_path.read_text(encoding="utf-8")

    # Replace <html lang=...>
    html = html.replace('<html lang="uk">', f'<html lang="{meta["lang"]}">', 1)
    html = html.replace('<html lang="en">', f'<html lang="{meta["lang"]}">', 1)

    # Replace <title> or insert if missing
    import re
    if re.search(r'<title[^>]*>[^<]*</title>', html):
        html = re.sub(r'<title[^>]*>[^<]*</title>', f'<title data-rh="true">{meta["title"]}</title>', html, count=1)
    else:
        # Inject <title> right after <head>
        html = html.replace('<head>', f'<head><title data-rh="true">{meta["title"]}</title>', 1)

    # Replace og: / twitter: tags
    replacements = {
        'og:title':            meta["title"],
        'og:description':      meta["description"],
        'og:url':              meta["url"],
        'twitter:title':       meta["title"],
        'twitter:description': meta["description"],
        'twitter:url':         meta["url"],
    }
    for prop, value in replacements.items():
        if prop.startswith("og:"):
            # Also handle both double and single quotes or no spaces just in case, though minifier uses double
            html = re.sub(
                rf'<meta property="{re.escape(prop)}" content="[^"]*"',
                f'<meta property="{prop}" content="{value}"',
                html, count=1
            )
        else:
            html = re.sub(
                rf'<meta name="{re.escape(prop)}" content="[^"]*"',
                f'<meta name="{prop}" content="{value}"',
                html, count=1
            )

    # Replace meta name="description"
    html = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{meta["description"]}"',
        html, count=1
    )

    return html


# ── Explicit SPA Routes for SEO / Social Sharing ─────────────────────────────
# All top-level page routes use dynamic OG injection so bots see correct previews.

async def _seo_response(path: str) -> HTMLResponse | FileResponse:
    html = build_seo_html(path)
    if html:
        return HTMLResponse(content=html)
    # Fallback if static dir not built yet
    return FileResponse(str(STATIC_DIR / "index.html"))


@app.get("/blog")
@app.get("/blog/{path:path}")
async def serve_blog(request: Request, path: str = ""):
    return await _seo_response(request.url.path)

@app.get("/en/blog")
@app.get("/en/blog/{path:path}")
async def serve_en_blog(request: Request, path: str = ""):
    return await _seo_response(request.url.path)

@app.get("/docs")
@app.get("/docs/{path:path}")
async def serve_docs(request: Request, path: str = ""):
    return await _seo_response(request.url.path)

@app.get("/en/docs")
@app.get("/en/docs/{path:path}")
async def serve_en_docs(request: Request, path: str = ""):
    return await _seo_response(request.url.path)

@app.get("/careers")
async def serve_careers(request: Request):
    return await _seo_response(request.url.path)

@app.get("/en/careers")
async def serve_en_careers(request: Request):
    return await _seo_response(request.url.path)

@app.get("/investors")
async def serve_investors(request: Request):
    return await _seo_response(request.url.path)

@app.get("/en/investors")
async def serve_en_investors(request: Request):
    return await _seo_response(request.url.path)

@app.get("/en")
async def serve_en_home(request: Request):
    return await _seo_response(request.url.path)


@app.exception_handler(StarletteHTTPException)
async def custom_404_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        path = request.url.path
        if path.startswith("/api/") or path.startswith("/downloads/"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)

        if STATIC_DIR.exists():
            rel_path = path.lstrip("/")
            # Serve root-level static files (favicon, manifest, etc.)
            if rel_path:
                file_path = STATIC_DIR / rel_path
                if file_path.exists() and file_path.is_file():
                    return FileResponse(str(file_path))

            # SPA fallback — inject SEO meta for known sections
            html = build_seo_html(path)
            if html:
                return HTMLResponse(content=html)

            index = STATIC_DIR / "index.html"
            if index.exists():
                return FileResponse(str(index))

    return JSONResponse({"detail": str(exc.detail)}, status_code=exc.status_code)


if not STATIC_DIR.exists():
    logger.warning("React build not found at %s — running API only", STATIC_DIR)
