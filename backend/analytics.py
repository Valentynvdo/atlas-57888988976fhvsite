from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import logging
from db import db

logger = logging.getLogger("atlas.analytics")
router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

class TrackEventRequest(BaseModel):
    event_name: str
    metadata: Optional[dict] = {}

def get_client_ip(request: Request) -> str:
    """Extract real client IP considering reverse proxies."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # X-Forwarded-For can contain a list of IPs, take the first one (client IP)
        ip = forwarded.split(",")[0].strip()
        if ip:
            return ip
    # Fallback to direct client host
    if request.client and request.client.host:
        return request.client.host
    return "unknown"

@router.post("/track")
async def track_event(req: TrackEventRequest, request: Request):
    try:
        ip_address = get_client_ip(request)
        user_agent = request.headers.get("user-agent", "unknown")
        
        event_doc = {
            "event_name": req.event_name,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "metadata": req.metadata,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.analytics_events.insert_one(event_doc)
        return {"ok": True}
    except Exception as e:
        logger.error(f"Error tracking event {req.event_name}: {e}")
        # Return success anyway so we don't break the frontend client
        return {"ok": False, "error": str(e)}
