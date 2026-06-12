#!/usr/bin/env python3
"""One-time palette migration: old neon blue/cyan/purple -> 2026 premium indigo/violet/cyan."""
import os, re

SRC = "/app/frontend/src"

# Ordered replacements (literal)
REPLACEMENTS = [
    # Primary blue -> indigo-violet
    ("#007AFF", "#6D5DF6"), ("#007aff", "#6D5DF6"),
    ("rgba(0,122,255", "rgba(109,93,246"), ("rgba(0, 122, 255", "rgba(109, 93, 246"),
    # Purple -> violet
    ("#9D4CDD", "#7C3AED"), ("#9d4cdd", "#7C3AED"),
    ("rgba(157,76,221", "rgba(124,58,237"), ("rgba(157, 76, 221", "rgba(124, 58, 237"),
    # Cyan -> tailwind cyan-400
    ("#00E5FF", "#22D3EE"), ("#00e5ff", "#22D3EE"),
    ("rgba(0,229,255", "rgba(34,211,238"), ("rgba(0, 229, 255", "rgba(34, 211, 238"),
    ("0x00e5ff", "0x22d3ee"),
    # Warm/acid accents -> soft premium tones
    ("#FF6B6B", "#F472B6"), ("rgba(255,107,107", "rgba(244,114,182"), ("rgba(255, 107, 107", "rgba(244, 114, 182"),
    ("#FF9A3C", "#A78BFA"), ("rgba(255,154,60", "rgba(167,139,250"), ("rgba(255, 154, 60", "rgba(167, 139, 250"),
    ("#FFD56B", "#67E8F9"), ("rgba(255,213,107", "rgba(103,232,249"), ("rgba(255, 213, 107", "rgba(103, 232, 249"),
    ("#FF6B9A", "#F472B6"),
    ("#ff2a5f", "#a855f7"),
    # Shader / sphere tints
    ("#0a1a3a", "#161233"), ("#3a1a6a", "#2a1b58"), ("#5a7bff", "#8b7cf8"),
    # Background tints
    ("#05050A", "#09090B"), ("#05050a", "#09090b"),
    ("#121020", "#111118"),
    # Light gradient tints -> violet-leaning
    ("#c4d4ff", "#cdc7ff"), ("#d4dcff", "#d8d2ff"), ("#c7d4ff", "#cfc8ff"), ("#b8f0ff", "#c3ecfa"),
]

changed = 0
for root, dirs, files in os.walk(SRC):
    if "locales" in root or "node_modules" in root:
        continue
    for fn in files:
        if not fn.endswith((".js", ".jsx", ".css")):
            continue
        p = os.path.join(root, fn)
        with open(p, "r", encoding="utf-8") as f:
            txt = f.read()
        orig = txt
        for old, new in REPLACEMENTS:
            txt = txt.replace(old, new)
        if txt != orig:
            with open(p, "w", encoding="utf-8") as f:
                f.write(txt)
            changed += 1
            print("updated:", p)
print("files changed:", changed)
