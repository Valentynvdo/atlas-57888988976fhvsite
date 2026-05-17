"""Stripe Checkout integration (one-time payment = 30 days extension)."""
import os
import logging
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)

from auth import get_current_user
from db import db

logger = logging.getLogger("atlas.billing")

router = APIRouter(prefix="/api/billing", tags=["billing"])
webhook_router = APIRouter(prefix="/api/webhook", tags=["webhook"])

# Fixed packages defined BACKEND-side only
PACKAGES = {
    "atlas_monthly": {"amount": 9.99, "currency": "usd", "days": 30, "label": "Atlas AI · Місяць"},
    "atlas_quarterly": {"amount": 24.99, "currency": "usd", "days": 90, "label": "Atlas AI · 3 місяці"},
    "atlas_yearly": {"amount": 79.99, "currency": "usd", "days": 365, "label": "Atlas AI · Рік"},
}


def _stripe(request: Request) -> StripeCheckout:
    api_key = os.environ["STRIPE_API_KEY"]
    host_url = str(request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    return StripeCheckout(api_key=api_key, webhook_url=webhook_url)


@router.get("/packages")
async def list_packages():
    return [
        {"id": k, **v} for k, v in PACKAGES.items()
    ]


@router.post("/checkout")
async def create_checkout(
    body: dict,
    request: Request,
    user: dict = Depends(get_current_user),
):
    package_id = body.get("package_id", "atlas_monthly")
    origin = body.get("origin_url") or str(request.base_url).rstrip("/")

    pkg = PACKAGES.get(package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Invalid package")

    sc = _stripe(request)
    success_url = f"{origin}/dashboard?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/dashboard"
    req = CheckoutSessionRequest(
        amount=pkg["amount"],
        currency=pkg["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user["user_id"],
            "email": user["email"],
            "package_id": package_id,
            "days": str(pkg["days"]),
        },
    )
    session = await sc.create_checkout_session(req)

    # Save pending transaction
    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "user_id": user["user_id"],
        "email": user["email"],
        "package_id": package_id,
        "amount": pkg["amount"],
        "currency": pkg["currency"],
        "days": pkg["days"],
        "payment_status": "initiated",
        "credited": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"url": session.url, "session_id": session.session_id}


@router.get("/checkout/status/{session_id}")
async def checkout_status(
    session_id: str,
    request: Request,
    user: dict = Depends(get_current_user),
):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx or tx["user_id"] != user["user_id"]:
        raise HTTPException(status_code=404, detail="Session not found")

    sc = _stripe(request)
    status = await sc.get_checkout_status(session_id)
    new_payment_status = status.payment_status

    # Update tx
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {
            "payment_status": new_payment_status,
            "status": status.status,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
    )

    # Credit once
    if new_payment_status == "paid" and not tx.get("credited"):
        await _credit_license(user["user_id"], int(tx["days"]))
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"credited": True}},
        )

    return {
        "status": status.status,
        "payment_status": new_payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
    }


async def _credit_license(user_id: str, days: int) -> None:
    """Extend the user's license by N days. Activates if inactive."""
    lic = await db.licenses.find_one({"user_id": user_id}, {"_id": 0})
    if not lic:
        return
    now = datetime.now(timezone.utc)
    current_exp = lic.get("expires_at")
    if isinstance(current_exp, str):
        current_exp = datetime.fromisoformat(current_exp)
    if current_exp and current_exp.tzinfo is None:
        current_exp = current_exp.replace(tzinfo=timezone.utc)
    base = current_exp if current_exp and current_exp > now else now
    new_exp = base + timedelta(days=days)
    await db.licenses.update_one(
        {"license_id": lic["license_id"]},
        {"$set": {
            "active": True,
            "expires_at": new_exp.isoformat(),
            "auto_renew": True,
        }},
    )


@webhook_router.post("/stripe")
async def stripe_webhook(request: Request):
    """Stripe webhook handler. Mounted at /api/webhook/stripe per playbook."""
    body = await request.body()
    sig = request.headers.get("Stripe-Signature")
    sc = _stripe(request)
    try:
        evt = await sc.handle_webhook(body, sig)
    except Exception as e:
        logger.warning("webhook parse failed: %s", e)
        raise HTTPException(status_code=400, detail="invalid webhook")

    if evt.event_type and "completed" in evt.event_type and evt.payment_status == "paid":
        tx = await db.payment_transactions.find_one({"session_id": evt.session_id}, {"_id": 0})
        if tx and not tx.get("credited"):
            await _credit_license(tx["user_id"], int(tx["days"]))
            await db.payment_transactions.update_one(
                {"session_id": evt.session_id},
                {"$set": {"credited": True, "payment_status": "paid"}},
            )

    return {"received": True}
