// Maps blog posts to AI-generated cover illustrations (UI only, no content change)
const COVERS = {
  privacy: "/images/blog-cover-privacy.png",
  automation: "/images/blog-cover-automation.png",
  voice: "/images/blog-cover-voice.png",
  llm: "/images/blog-cover-llm.png",
  future: "/images/blog-cover-future.png",
};

const MAP = {
  "why-atlas-ai-is-the-best-raycast-alternative": COVERS.privacy,
  "how-to-control-macos-remotely-via-telegram-bot": COVERS.automation,
  "how-to-run-local-llm-on-macos-with-ollama": COVERS.llm,
  "voice-controlled-ai-productivity-hacks-macos": COVERS.voice,
  "local-ai-setup": COVERS.llm,
  "why-we-created-atlas": COVERS.future,
  "ai-impact-on-humanity": COVERS.future,
  "macos-automation-future": COVERS.automation,
  "privacy-first-ai": COVERS.privacy,
  "evolution-of-ai-assistants": COVERS.future,
  "top-10-mac-hacks": COVERS.automation,
  "ai-in-software-development": COVERS.llm,
  "getting-started-with-atlas": COVERS.automation,
  "future-of-voice-interfaces": COVERS.voice,
  "security-in-ai-tools": COVERS.privacy,
};

const FALLBACKS = Object.values(COVERS);

export function getBlogCover(slug, index = 0) {
  return MAP[slug] || FALLBACKS[index % FALLBACKS.length];
}
