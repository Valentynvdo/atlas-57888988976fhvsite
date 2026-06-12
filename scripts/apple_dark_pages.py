#!/usr/bin/env python3
"""Bulk replace remaining neon colors with Apple Dark palette in JSX/CSS files."""
import os, re, sys

# Files to clean (avoid touching index.css, components/atlas/* already done)
TARGETS = [
    "frontend/src/pages/BlogList.jsx",
    "frontend/src/pages/BlogPost.jsx",
    "frontend/src/pages/Docs.jsx",
    "frontend/src/pages/DocsPost.jsx",
    "frontend/src/pages/Privacy.jsx",
    "frontend/src/pages/Terms.jsx",
    "frontend/src/pages/Contacts.jsx",
    "frontend/src/pages/Careers.jsx",
    "frontend/src/pages/Investors.jsx",
    "frontend/src/pages/Dashboard.jsx",
    "frontend/src/pages/Admin.jsx",
    "frontend/src/pages/AdminPin.jsx",
    "frontend/src/pages/InviteHandler.jsx",
]

ROOT = "/app"

# Direct hex replacements (neon → Apple Dark equivalents)
HEX_MAP = {
    # Cyan-ish → Apple blue OR neutral white
    "#22D3EE": "#2997ff",
    "#22d3ee": "#2997ff",
    # Violet/purple → neutral
    "#6D5DF6": "#f5f5f7",
    "#6d5df6": "#f5f5f7",
    "#7C3AED": "#f5f5f7",
    "#7c3aed": "#f5f5f7",
    "#A78BFA": "#a1a1a6",
    "#a78bfa": "#a1a1a6",
    "#4F46E5": "#0a84ff",
    "#4f46e5": "#0a84ff",
    "#F472B6": "#a1a1a6",
    "#f472b6": "#a1a1a6",
}

# rgba patterns — neutralize purple/cyan glow
RGBA_PATTERNS = [
    (re.compile(r"rgba\(\s*109\s*,\s*93\s*,\s*246\s*,\s*([0-9.]+)\s*\)"),
     lambda m: f"rgba(255,255,255,{min(float(m.group(1))*0.5, 0.18):.3f})"),
    (re.compile(r"rgba\(\s*124\s*,\s*58\s*,\s*237\s*,\s*([0-9.]+)\s*\)"),
     lambda m: f"rgba(255,255,255,{min(float(m.group(1))*0.5, 0.18):.3f})"),
    (re.compile(r"rgba\(\s*34\s*,\s*211\s*,\s*238\s*,\s*([0-9.]+)\s*\)"),
     lambda m: f"rgba(255,255,255,{min(float(m.group(1))*0.6, 0.2):.3f})"),
    (re.compile(r"rgba\(\s*79\s*,\s*70\s*,\s*229\s*,\s*([0-9.]+)\s*\)"),
     lambda m: f"rgba(10,132,255,{m.group(1)})"),
]

# Linear-gradient rainbow lines → solid #f5f5f7
GRADIENT_TEXT_RE = re.compile(
    r'background:\s*"linear-gradient\([^"]*?(?:#fff|#FFFFFF|#ffffff)[^"]*?(?:#d8d2ff|#a5b4fc|#cdc7ff|22D3EE|7C3AED|6D5DF6)[^"]*?"',
    re.IGNORECASE
)

def clean_file(path):
    full = os.path.join(ROOT, path)
    if not os.path.exists(full):
        return False
    with open(full, "r", encoding="utf-8") as f:
        text = f.read()
    orig = text

    # hex replace
    for k, v in HEX_MAP.items():
        text = text.replace(k, v)
    # rgba
    for rx, fn in RGBA_PATTERNS:
        text = rx.sub(fn, text)
    # rainbow gradient text → solid
    text = GRADIENT_TEXT_RE.sub('color: "#f5f5f7", background: "none"', text)

    if text != orig:
        with open(full, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"updated {path}")
        return True
    return False

count = sum(1 for p in TARGETS if clean_file(p))
print(f"Done. Files modified: {count}")
