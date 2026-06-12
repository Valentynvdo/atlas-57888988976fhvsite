# Atlas AI — Product Requirements & Changelog

## Original Problem Statement
Complete UI/UX redesign of "Atlas AI" website to achieve a modern Apple/Mac premium aesthetic.

## Active Mandate (Feb 2026)
User requested (Ukrainian):
- Прибрати неонові ефекти
- Прибрати сферу (3D EnergySphere)
- Сучасний Apple/Mac дизайн (Dark variant)
- Hero секція що продає (animated product preview)
- Прибрати дублюючи елементи (11 sections → 5–6)
- Красивий дизайн для всіх секцій
- Pricing teaser на лендінгу + окрема сторінка
- Мінімальні анімації, лише плавний fade-in

## Design System (current)
- Palette: pure black `#000` background, graphite cards `#1d1d1f`, hairline `rgba(255,255,255,0.06)`
- Text: primary `#f5f5f7`, secondary `#a1a1a6`
- Accent: Apple blue `#0071e3` / `#2997ff` (links, "popular" highlights, user chat bubbles)
- Typography: SF Pro Display / SF Pro Text, letter-spacing -0.025em on headings
- Buttons: white pill (primary), translucent ghost (secondary), Apple-style chevron link
- No neon glow, no rainbow gradients, no 3D sphere
- Subtle CSS animations only (fade-in, typing dots, bubble appear)

## Landing Structure (5 main + SEO + Footer)
1. Hero — Apple title + animated Mac window chat preview
2. BentoFeatures — `#features` graphite card grid (10 capabilities)
3. HowItWorks — `#how-it-works` 3 numbered cards
4. AtlasComparison — `#comparison` VS layout (Normal AI vs Atlas)
5. PricingTeaser — `#pricing` horizontal card → /pricing
6. FinalCTA — closing graphite plate
7. AtlasSEOContent — kept in DOM (collapsed tabs) for SEO
8. Footer — multi-column Apple-style

Removed components from landing: AtlasLiveThought, TechInfrastructure, LivingIntelligence,
MacOSControl, SmartConcierge, AbsoluteAwareness, AtlasInteractions, WaitlistSection,
EnergySphere. Files preserved on disk; only landing imports were removed.

## Pages Status (Apple Dark redesign)
- ✅ / (Landing) — full redesign
- ✅ /pricing — rewritten Apple Dark
- ⏳ /docs, /docs/:slug — uses legacy styles, inherits dark palette but cards still need polish
- ⏳ /blog, /blog/:slug — previously rewritten with glass but accent colors changed via CSS vars
- ⏳ /login — not touched yet
- ⏳ /dashboard, /x7k9m-admin — not touched yet
- ⏳ /privacy, /terms, /contacts, /careers, /investors — inherit Apple Dark vars, may need polish

## Files Modified (this session)
- `frontend/src/index.css` — palette switched to Apple Dark, removed neon CSS,
  added `.apple-hero`, `.mac-preview`, `.apple-section`, `.steps-grid`,
  `.pricing-teaser-card`, `.apple-nav`
- `frontend/src/App.js` — slim Landing to 5 visual sections + SEO + Footer; removed grain overlay
- `frontend/src/components/atlas/Hero.jsx` — full rewrite, animated Mac chat preview, EnergySphere removed
- `frontend/src/components/atlas/Navbar.jsx` — Apple translucent top bar with fallback labels
- `frontend/src/components/atlas/Footer.jsx` — Apple multi-column footer
- `frontend/src/components/atlas/FinalCTA.jsx` — graphite card, no gradient text
- `frontend/src/components/atlas/BentoFeatures.jsx` — neutralized rainbow accents, fixed JSX bug (`</div>` → `</article>`)
- `frontend/src/components/atlas/AtlasComparison.jsx` — removed neon glows
- `frontend/src/pages/Pricing.jsx` — full Apple Dark rewrite

## Files Created
- `frontend/src/components/atlas/HowItWorks.jsx`
- `frontend/src/components/atlas/PricingTeaser.jsx`

## Backlog (P1)
- Audit and restyle /docs, /blog, /login, /dashboard, /admin to Apple Dark
- Localize hero `t("hero.title_span")` to a punchier short phrase (currently 3-line wrap on desktop)
- Optional: remove unused legacy section components (TechInfrastructure, EnergySphere etc.)
- Add subtle scroll-triggered fade-in to Mac preview entrance

## Test Credentials
- Admin: `admin@atlas.com` / `srv-d84mtqjtqb8s73fgcjog`
