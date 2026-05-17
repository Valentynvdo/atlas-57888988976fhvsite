"""Pydantic models for Atlas AI backend."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    provider: str = "google"
    avatar_url: Optional[str] = None
    created_at: datetime
    is_blocked: bool = False
    admin_notes: Optional[str] = ""


class License(BaseModel):
    model_config = ConfigDict(extra="ignore")
    license_id: str
    user_id: str
    key: str
    mac_id: Optional[str] = None
    mac_name: Optional[str] = None
    active: bool = False
    created_at: datetime
    expires_at: Optional[datetime] = None
    stripe_customer_id: Optional[str] = None
    last_payment_session: Optional[str] = None


class AtlasStats(BaseModel):
    model_config = ConfigDict(extra="ignore")
    license_id: str
    version: str = "—"
    days_active: int = 0
    skills_count: int = 0
    evolutions_count: int = 0
    requests_count: int = 0
    last_evolution: Optional[datetime] = None
    last_check: Optional[datetime] = None


class CreateCheckoutRequest(BaseModel):
    origin_url: str


class ActivateLicenseRequest(BaseModel):
    key: str
    mac_id: str
    mac_name: Optional[str] = "Mac"


class ValidateKeyRequest(BaseModel):
    key: str
    mac_id: str


class TransferLicenseRequest(BaseModel):
    license_id: str


class AdminPinRequest(BaseModel):
    pin: str


class AdminUserAction(BaseModel):
    user_id: str
    action: str  # extend | cancel | regen_key | reset_mac | block | unblock | save_notes
    notes: Optional[str] = None
    days: Optional[int] = 30


class AdminGenerateKeyRequest(BaseModel):
    email: str
    days: int = 30
