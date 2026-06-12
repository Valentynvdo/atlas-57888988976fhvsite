#!/usr/bin/env python3
"""One-time AI illustration generation via Gemini Nano Banana (Emergent key)."""
import asyncio, base64, os, sys
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")
sys.path.insert(0, "/app/backend")

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT = "/app/frontend/public/images"
os.makedirs(OUT, exist_ok=True)

STYLE = ("Ultra premium dark futuristic 3D digital illustration, deep charcoal background #09090B, "
         "glowing indigo violet #6D5DF6 and cyan #22D3EE accents, glassmorphism, soft volumetric light, "
         "cinematic depth of field, minimalist Apple-style aesthetic, no text, no letters, no watermark, 16:9")

PROMPTS = {
    "hero-atlas-app.png": (
        "A sleek dark macOS desktop application window for an AI assistant called Atlas, floating in dark space. "
        "Frosted glass panels, a glowing orb of energy in the center of the interface, chat sidebar, elegant charts, "
        "rounded corners, traffic-light window dots. " + STYLE
    ),
    "blog-cover-privacy.png": (
        "A translucent glass shield protecting a glowing neural core, locks and encrypted particles orbiting around it. " + STYLE
    ),
    "blog-cover-automation.png": (
        "Abstract flowing streams of luminous data connecting floating glass app windows above a dark MacBook keyboard. " + STYLE
    ),
    "blog-cover-voice.png": (
        "Elegant 3D sound waves made of glowing violet and cyan light ribbons emanating from a minimal glass microphone orb. " + STYLE
    ),
    "blog-cover-llm.png": (
        "A glowing computer chip with a holographic brain hovering above it, local neural network nodes, dark premium scene. " + STYLE
    ),
    "blog-cover-future.png": (
        "A luminous humanoid silhouette made of particles facing a vast holographic interface horizon, sense of future AI. " + STYLE
    ),
}

async def gen(name, prompt):
    chat = LlmChat(api_key=os.getenv("EMERGENT_LLM_KEY"), session_id=f"imgenc-{name}", system_message="You are an image generator")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if images:
        with open(os.path.join(OUT, name), "wb") as f:
            f.write(base64.b64decode(images[0]["data"]))
        print("saved", name)
    else:
        print("NO IMAGE for", name, "| text:", (text or "")[:100])

async def main():
    for name, prompt in PROMPTS.items():
        try:
            await gen(name, prompt)
        except Exception as e:
            print("ERROR", name, repr(e)[:200])

asyncio.run(main())
