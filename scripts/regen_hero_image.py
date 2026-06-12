#!/usr/bin/env python3
"""Regenerate ONLY hero-atlas-app.png in Apple Dark style — pure window, no background."""
import asyncio, base64, os, sys
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")
sys.path.insert(0, "/app/backend")

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT = "/app/frontend/public/images"
os.makedirs(OUT, exist_ok=True)

PROMPT = (
    "Photorealistic isolated screenshot of a macOS application window for an AI assistant called Atlas. "
    "PURE SOLID BLACK BACKGROUND #000000, no stars, no galaxies, no nebula, no glow, no light leak — "
    "just the clean rounded macOS window on flat black. "
    "The window has: traffic-light dots (red/yellow/green) in the top-left, a thin titlebar with the label 'Atlas AI', "
    "a left sidebar with workspaces (Conversations, Mail, Calendar, Notes, Files) using subtle SF Pro Text labels, "
    "the main panel shows a clean Apple-style chat conversation with rounded blue (#0071e3) user bubbles on the right "
    "and dark gray (#2c2c2e) assistant bubbles on the left, neat typography. "
    "Window styling: graphite #1d1d1f surfaces, hairline borders rgba(255,255,255,0.08), gentle 3D shadow under the window. "
    "Apple Mac modern aesthetic, minimalistic, premium, no text artifacts, sharp focus, 16:9, professional product shot."
)

async def main():
    chat = LlmChat(
        api_key=os.getenv("EMERGENT_LLM_KEY"),
        session_id="atlas-hero-apple-dark",
        system_message="You are an image generator"
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=PROMPT))
    if images:
        path = os.path.join(OUT, "hero-atlas-app.png")
        with open(path, "wb") as f:
            f.write(base64.b64decode(images[0]["data"]))
        print(f"saved {path}")
    else:
        print("NO IMAGE | text:", (text or "")[:200])

asyncio.run(main())
