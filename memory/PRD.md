# Atlas AI — Product Requirements & Changelog

## Original Problem Statement
Complete UI/UX redesign of "Atlas AI" website to Apple/Mac modern aesthetic.
SEO content (H1/H2/meta) MUST be preserved in DOM.

## Active Mandate (Feb 2026 — iter 3)
User requested:
- ✅ Hero — **full‑width / full‑height** container with smooth **fade-out** at bottom
- ✅ Navbar — beautiful **rounded pill** floating container
- ✅ Lower hero — remove duplicate copy ("Створено для macOS / Реальні дії / Приватність") — keep only the clean product image
- ✅ FinalCTA — **no container**, plain text on page with subtle aurora glow
- ✅ Blog/Docs/Login/Privacy/Terms/Contacts/Careers/Investors/Dashboard/Admin — bulk‑swept old neon palette → Apple Dark
- ✅ Login — graphite card on solid black, no glow

## Design System (current)
- Background: `#000` solid
- Surfaces: `#161617` / `#1d1d1f` graphite cards
- Hairlines: `rgba(255,255,255,0.06)` / `0.08`
- Text: primary `#f5f5f7`, secondary `#a1a1a6`
- Accent: Apple blue `#2997ff` / `#0a84ff`
- Typography: SF Pro Display / Text, letter-spacing -0.025em
- Buttons: white pill (primary), translucent ghost (secondary)
- Animations: aurora drift (18s), title shine (8s), demo terminal typing
- No neon, no rainbow gradients, no 3D sphere

## Landing Structure
1. Hero — full‑bleed background, aurora behind title, seamless product image + fade-out
2. BentoFeatures — clickable graphite cards → demo modal
3. HowItWorks — 3 numbered cards
4. AtlasComparison — VS layout
5. FinalCTA — plain text with aurora (no container)
6. AtlasSEOContent — preserved in DOM
7. Footer — multi-column Apple-style

## Files Modified (iter 3)
- `frontend/src/index.css` — added `.hero-card-full`, `.hero-card-inner`, `.hero-fade-bottom`, navbar pill rebuilt
- `frontend/src/components/atlas/Hero.jsx` — full-bleed top section, removed duplicate copy block, clean image showcase
- `frontend/src/components/atlas/Navbar.jsx` — pill inner now applies background dynamically
- `frontend/src/components/atlas/FinalCTA.jsx` — removed boxed container, plain text + aurora
- `frontend/src/pages/Login.jsx` — solid black background, graphite card, removed neon glow
- `scripts/apple_dark_pages.py` — created; swept 10 pages replacing neon hex/rgba → Apple Dark
- Pages bulk-swept: BlogList, BlogPost, Docs, Privacy, Terms, Contacts, Careers, Investors, Dashboard, Admin

## Backlog (P1)
- Replace AI-generated cover images on /blog (still show old purple sphere visuals from previous Gemini batch). Regenerate via Gemini Nano Banana to match Apple Dark
- Polish DocsPost.jsx (single article page) — script didn't catch some inline styles
- Manual review of Admin.jsx tables — bulk replace may have neutralized intentional brand colors

## Test Credentials
- Admin: `admin@atlas.com` / `srv-d84mtqjtqb8s73fgcjog`
