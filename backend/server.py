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

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("atlas")

app = FastAPI(title="Atlas AI Backend")


@app.on_event("startup")
async def startup():
    await init_pool()


@app.on_event("shutdown")
async def shutdown():
    await close_pool()
    client.close()


@app.get("/api/health")
async def health():
    return {"ok": True}


# Serve uploads
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/downloads", StaticFiles(directory=str(UPLOAD_DIR)), name="downloads")


# Routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(billing_router)
app.include_router(webhook_router)
app.include_router(atlas_router)
app.include_router(admin_router)


# CORS middleware
@app.middleware("http")
async def cors(request: Request, call_next):
    origin = request.headers.get("origin")
    if request.method == "OPTIONS":
        from fastapi.responses import Response
        r = Response()
        if origin:
            r.headers["Access-Control-Allow-Origin"] = origin
            r.headers["Access-Control-Allow-Credentials"] = "true"
            r.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            r.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Session-ID"
        return r
    response = await call_next(request)
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Session-ID"
    return response
