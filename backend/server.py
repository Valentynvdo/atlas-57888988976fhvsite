"""Atlas AI backend — main FastAPI app with modular routers."""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Import routers AFTER load_dotenv so env vars are available
from auth import router as auth_router  # noqa: E402
from dashboard import router as dashboard_router  # noqa: E402
from billing import router as billing_router, webhook_router  # noqa: E402
from atlas import router as atlas_router  # noqa: E402
from admin import router as admin_router  # noqa: E402
from db import client  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("atlas")

app = FastAPI(title="Atlas AI Backend")


@app.get("/api/health")
async def health():
    return {"ok": True}


# Serve uploads (Atlas .dmg files) at /downloads
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/downloads", StaticFiles(directory=str(UPLOAD_DIR)), name="downloads")


# Routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(billing_router)
app.include_router(webhook_router)
app.include_router(atlas_router)
app.include_router(admin_router)


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
