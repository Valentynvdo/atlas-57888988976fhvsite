"""One-time generator for Atlas AI macOS-style app icon.

Saves PNG to /app/frontend/public/atlas-icon.png.
Run: python3 /app/scripts/generate_icon.py
"""
import asyncio
import base64
import os
import sys
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402

OUT_DIR = "/app/frontend/public"
os.makedirs(OUT_DIR, exist_ok=True)

PROMPT = (
    "A premium macOS app icon for an AI assistant named 'Atlas AI'. "
    "Squircle (rounded-square) shape following Apple's macOS Big Sur / Sonoma design language. "
    "Centered on the icon: a luminous spherical orb that looks like a glowing energy core — "
    "a glassy, semi-translucent sphere with deep cosmic blue and violet inside, "
    "an electric cyan rim glow, and subtle inner energy striations resembling a tiny nebula or aurora. "
    "Background of the squircle: smooth dark gradient from deep midnight black (#000000) at edges "
    "to a soft blue-violet (#1a1240) near the center, "
    "with very faint star-dust particles. "
    "Soft inner highlight at top of the squircle (glass-light), subtle outer drop shadow. "
    "Ultra clean, modern, minimal, premium, Apple-quality. "
    "No text, no letters, no logo type, just the abstract glowing sphere centered. "
    "Plain transparent or white background OUTSIDE the squircle so the icon can be cropped. "
    "Photorealistic 3D render, 1024x1024, crisp, perfect symmetry."
)


async def main() -> None:
    api_key = os.getenv("EMERGENT_LLM_KEY")
    if not api_key:
        print("ERROR: EMERGENT_LLM_KEY missing", file=sys.stderr)
        sys.exit(1)

    chat = (
        LlmChat(
            api_key=api_key,
            session_id="atlas-icon-gen-1",
            system_message="You are a premium product icon designer.",
        )
        .with_model("gemini", "gemini-3.1-flash-image-preview")
        .with_params(modalities=["image", "text"])
    )

    text, images = await chat.send_message_multimodal_response(UserMessage(text=PROMPT))
    print(f"text: {text[:120] if text else '(none)'}")
    if not images:
        print("No images returned")
        sys.exit(2)

    img = images[0]
    print(f"mime: {img['mime_type']}, b64 head: {img['data'][:10]}...")
    out_path = os.path.join(OUT_DIR, "atlas-icon.png")
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(img["data"]))
    print(f"Saved {out_path} ({os.path.getsize(out_path)} bytes)")


if __name__ == "__main__":
    asyncio.run(main())
