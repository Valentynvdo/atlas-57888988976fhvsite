# Atlas AI — Product Requirements & Changelog

## Original Problem Statement
Complete UI/UX redesign of "Atlas AI" website to achieve a modern Apple/Mac premium aesthetic. SEO content (H1/H2/meta) MUST be preserved in DOM.

## Active Mandate (Feb 2026 — iter 2)
User requested:
- ✅ Прибрати неонові ефекти
- ✅ Прибрати сферу (3D EnergySphere)
- ✅ Прибрати Mac preview window з Hero
- ✅ Hero: верхній і нижній **заокруглені контейнери** з красивою анімацією за заголовком (м'який aurora blob)
- ✅ Hero showcase: нижній заокруглений контейнер із product image (`/images/hero-atlas-app.png`)
- ✅ Видалити PricingTeaser секцію з лендінгу (натомість nav‑link `Ціни` веде на `/pricing`)
- ✅ BentoFeatures cards — **клікабельні з demo modal анімацією** (Apple‑style fade‑in + terminal typing demo)
- ✅ FinalCTA — Apple Mac modern, заокруглений контейнер з aurora animation
- ⏳ Передизайн `/docs`, `/blog`, `/login`, `/dashboard`, `/admin` (defer — backlog)

## Design System
- Background: `#000` solid, no gradients
- Surfaces: `#161617` / `#1d1d1f` graphite cards
- Hairlines: `rgba(255,255,255,0.06)`
- Text: primary `#f5f5f7`, secondary `#a1a1a6`
- Accent: Apple blue `#0071e3` / `#2997ff` for links and highlights
- Typography: SF Pro Display / SF Pro Text, letter‑spacing -0.025em
- Buttons: white pill (primary), translucent ghost (secondary)
- Animations: subtle aurora drift (18s), title shine (8s), demo terminal typing
- No neon, no rainbow gradients, no 3D sphere

## Landing Structure (final)
1. Hero — rounded card with aurora animation + Apple title + CTA
2. Hero Showcase — rounded card with proof eyebrow + heading + product image
3. BentoFeatures — `#features` clickable graphite cards → demo modal
4. HowItWorks — `#how-it-works` 3 numbered cards
5. AtlasComparison — `#comparison`
6. FinalCTA — rounded card with aurora animation
7. AtlasSEOContent — preserved in DOM for indexing
8. Footer — Apple multi‑column

## Files Modified (this iteration)
- `frontend/src/index.css` — added `.hero-aurora`, `.hero-grid`, `.hero-title-anim`, `.hero-showcase`, `.feature-card-btn`, `.demo-line`, modal animations
- `frontend/src/App.js` — removed PricingTeaser import + usage
- `frontend/src/components/atlas/Hero.jsx` — rewritten: top rounded card with aurora animation, bottom rounded card with image showcase, no Mac preview, no sphere
- `frontend/src/components/atlas/FinalCTA.jsx` — rounded card with aurora, shine title animation
- `frontend/src/components/atlas/BentoFeatures.jsx` — cards converted to `<button>`, FeatureDemoModal added with terminal typing demo
- `frontend/src/components/atlas/Navbar.jsx`, `Footer.jsx`, `AtlasComparison.jsx`, `pages/Pricing.jsx` — Apple Dark style

## Files Created
- `frontend/src/components/atlas/HowItWorks.jsx`
- `frontend/src/components/atlas/PricingTeaser.jsx` (created but no longer imported — kept for future use)

## Backlog (P1)
- Apple Dark redesign for `/docs`, `/blog`, `/login`, `/dashboard`, `/x7k9m-admin`
- Replace static `hero-atlas-app.png` with a new generated image that matches new Apple Dark aesthetic (current one shows old purple sphere)
- Add scroll-triggered fade‑in to Hero showcase image entrance

## Test Credentials
- Admin: `admin@atlas.com` / `srv-d84mtqjtqb8s73fgcjog`
