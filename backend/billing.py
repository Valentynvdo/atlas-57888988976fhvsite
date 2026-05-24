"""Billing: TON Connect payment + live price + Stripe stub."""
import logging
import os
from datetime import datetime, timezone, timedelta

import httpx
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request

from auth import get_current_user, _generate_key
from db import db

logger = logging.getLogger("atlas.billing")

router = APIRouter(prefix="/api/billing", tags=["billing"])
webhook_router = APIRouter(prefix="/api/webhook", tags=["webhook"])

TON_RECEIVER = os.getenv("TON_RECEIVER_ADDRESS", "")
TON_PRICE_USD = float(os.getenv("TON_PRICE_USD", "28.99"))

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

PACKAGES = {
    "atlas_monthly":   {"amount": 28.99,  "currency": "usd", "days": 30,  "label": "Atlas AI · Місяць", "stripe_price_id": "price_1TXxzdD8ZxqWes01QO0e5AWU"},
    "atlas_quarterly": {"amount": 74.99,  "currency": "usd", "days": 90,  "label": "Atlas AI · 3 місяці", "stripe_price_id": "price_1TaUQaD8ZxqWes01yn6fI6Hy"},
    "atlas_yearly":    {"amount": 249.99, "currency": "usd", "days": 365, "label": "Atlas AI · Рік", "stripe_price_id": "price_1TaUR8D8ZxqWes017NfUcvnm"},
}


# ──────────────────────────────────────────────────────────────────────────────
# Live TON price via CoinGecko (no API key required)
# ──────────────────────────────────────────────────────────────────────────────

async def _get_ton_price_usd() -> float:
    """Returns current TON price in USD from CoinGecko."""
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "the-open-network", "vs_currencies": "usd"},
            )
            if r.status_code == 200:
                data = r.json()
                return float(data["the-open-network"]["usd"])
    except Exception as e:
        logger.warning("CoinGecko failed: %s", e)
    return 1.90  # fallback price


def _usd_to_ton(usd: float, ton_price: float) -> float:
    """Convert USD amount to TON, rounded to 2 decimal places."""
    return round(usd / ton_price, 2)


# ──────────────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/packages")
async def list_packages():
    return [{"id": k, **v} for k, v in PACKAGES.items()]


@router.get("/ton-price")
async def ton_price():
    """Returns live TON/USD rate and required TON amount for each package."""
    usd_per_ton = await _get_ton_price_usd()
    packages_ton = []
    for pkg_id, pkg in PACKAGES.items():
        ton_amount = _usd_to_ton(pkg["amount"], usd_per_ton)
        ton_nano = int(ton_amount * 1e9)  # nanotons for sendTransaction
        packages_ton.append({
            "id": pkg_id,
            "label": pkg["label"],
            "usd": pkg["amount"],
            "days": pkg["days"],
            "ton_amount": ton_amount,
            "ton_nano": str(ton_nano),
            "receiver": TON_RECEIVER,
        })
    return {
        "ton_usd_price": usd_per_ton,
        "receiver": TON_RECEIVER,
        "packages": packages_ton,
    }


@router.post("/ton-verify")
async def verify_ton_payment(body: dict, user: dict = Depends(get_current_user)):
    """
    Verify a TON transaction sent by the user.
    Body: { wallet_address, ton_amount, package_id, tx_hash (optional) }
    Checks TonCenter API for recent transactions to our receiver address.
    """
    wallet_address = (body.get("wallet_address") or "").strip()
    package_id = body.get("package_id", "atlas_monthly")
    ton_sent = float(body.get("ton_amount", 0))
    tx_hash = body.get("tx_hash", "")

    pkg = PACKAGES.get(package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Invalid package")

    # Get live price and calculate expected amount (with 5% tolerance for price volatility)
    usd_per_ton = await _get_ton_price_usd()
    expected_ton = _usd_to_ton(pkg["amount"], usd_per_ton)
    min_ton = expected_ton * 0.85  # 15% tolerance for price swings

    # Verify via TonCenter API
    verified = False
    actual_amount_ton = 0.0
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(
                "https://toncenter.com/api/v2/getTransactions",
                params={"address": TON_RECEIVER, "limit": 30},
            )
            if r.status_code == 200:
                txs = r.json().get("result", [])
                now_ts = datetime.now(timezone.utc).timestamp()
                for tx in txs:
                    # Only transactions from last 15 minutes
                    tx_time = tx.get("utime", 0)
                    if now_ts - tx_time > 900:
                        continue
                    in_msg = tx.get("in_msg", {})
                    source = in_msg.get("source", "")
                    value_nano = int(in_msg.get("value", 0))
                    value_ton = value_nano / 1e9

                    # Match by sender wallet OR tx hash
                    sender_match = source and (
                        source == wallet_address or
                        source.replace("0:", "EQ").replace("-1:", "UQ") == wallet_address
                    )
                    hash_match = tx_hash and tx.get("transaction_id", {}).get("hash", "") == tx_hash

                    if (sender_match or hash_match) and value_ton >= min_ton:
                        verified = True
                        actual_amount_ton = value_ton
                        break
    except Exception as e:
        logger.error("TonCenter verification error: %s", e)
        raise HTTPException(status_code=503, detail="Помилка перевірки транзакції. Спробуйте пізніше.")

    if not verified:
        raise HTTPException(
            status_code=402,
            detail=f"Транзакцію не знайдено. Надіслано: {ton_sent:.2f} TON, очікувалось: ≥{min_ton:.2f} TON"
        )

    # Check if this tx_hash was already credited
    if tx_hash:
        already = await db.payment_transactions.find_one({"ton_tx_hash": tx_hash, "credited": True})
        if already:
            raise HTTPException(status_code=409, detail="Цю транзакцію вже зараховано.")

    # Credit the license
    await _credit_license(user["user_id"], pkg["days"])

    # Log transaction
    await db.payment_transactions.insert_one({
        "session_id": f"ton_{tx_hash or wallet_address[:12]}_{int(datetime.now().timestamp())}",
        "user_id": user["user_id"],
        "email": user["email"],
        "package_id": package_id,
        "amount": pkg["amount"],
        "currency": "ton",
        "days": pkg["days"],
        "payment_status": "paid",
        "credited": True,
        "ton_tx_hash": tx_hash,
        "ton_address": wallet_address,
        "ton_amount": actual_amount_ton,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"ok": True, "days_added": pkg["days"], "message": "Підписку активовано!"}


async def _credit_license(user_id: str, days: int) -> None:
    lic = await db.licenses.find_one({"user_id": user_id})
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
        {"$set": {"active": True, "expires_at": new_exp.isoformat(), "auto_renew": True}},
    )


# ──────────────────────────────────────────────────────────────────────────────
# Stripe Integration
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/checkout")
async def create_checkout(body: dict, request: Request, user: dict = Depends(get_current_user)):
    package_id = body.get("package_id", "atlas_monthly")
    origin = body.get("origin_url") or str(request.base_url).rstrip("/")
    pkg = PACKAGES.get(package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail="Invalid package")
        
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe API key not configured")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price": pkg["stripe_price_id"],
                "quantity": 1,
            }],
            mode="subscription",
            success_url=f"{origin}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{origin}/dashboard",
            customer_email=user["email"],
            client_reference_id=user["user_id"],
            metadata={
                "user_id": user["user_id"],
                "package_id": package_id,
                "days": pkg["days"]
            }
        )
        
        await db.payment_transactions.insert_one({
            "session_id": session.id,
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
        
        return {"url": session.url, "session_id": session.id}
    except Exception as e:
        logger.error("Stripe checkout error: %s", e)
        raise HTTPException(status_code=500, detail="Could not create checkout session")


@router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, user: dict = Depends(get_current_user)):
    tx = await db.payment_transactions.find_one({"session_id": session_id})
    if not tx or tx["user_id"] != user["user_id"]:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Optional: fetch latest status from Stripe
    if tx["payment_status"] == "initiated" and stripe.api_key:
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.payment_status == "paid":
                tx["payment_status"] = "paid"
                # If not credited yet, webhook will handle it or we can fallback here.
        except Exception as e:
            logger.warning("Failed to retrieve stripe session: %s", e)

    return {"status": "complete", "payment_status": tx.get("payment_status", "initiated"), "amount_total": tx.get("amount", 0), "currency": "usd"}


@webhook_router.post("/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not STRIPE_WEBHOOK_SECRET:
        logger.warning("Stripe webhook received but secret is not set")
        return {"received": True}

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        
        user_id = session.get("client_reference_id")
        metadata = session.get("metadata", {})
        package_id = metadata.get("package_id")
        days = int(metadata.get("days", 30))
        session_id = session.get("id")
        
        if user_id and package_id:
            # Mark transaction as paid and credited
            tx = await db.payment_transactions.find_one({"session_id": session_id})
            if tx and not tx.get("credited"):
                await _credit_license(user_id, days)
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "paid", "credited": True}}
                )
                logger.info("Credited %d days to user %s from Stripe webhook", days, user_id)
            elif not tx:
                # Fallback if tx wasn't created properly
                await _credit_license(user_id, days)
                await db.payment_transactions.insert_one({
                    "session_id": session_id,
                    "user_id": user_id, 
                    "package_id": package_id, 
                    "days": days,
                    "payment_status": "paid", 
                    "credited": True,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })
                
    return {"received": True}
