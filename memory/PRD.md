# Atlas AI — Landing Page

## Original Problem Statement (verbatim)
Створи преміальний, сучасний та інтерактивний Landing Page для продукту "Atlas AI" — найрозумнішого автономного асистента для macOS.

Дизайн: тільки Dark Mode (#000/#0a0a0c), Inter/SF Pro typography, glassmorphism, неонові градієнти (синій/фіолетовий/бірюзовий).

Структура:
1. Hero з 3D пульсуючою сферою + заголовок "Atlas AI. Ваш персональний всесвіт."
2. Живий Інтелект (автономність + нейронні зв'язки)
3. Повний контроль над macOS (3 glassmorphism картки)
4. Smart Concierge (Bolt/Uber/Glovo/готелі/квитки) — карусель
5. Абсолютна Свідомість (FaceID/біометрія + пам'ять)

## User Choices
- Stack: React + Tailwind (existing CRA)
- Sphere: Three.js / WebGL
- Static landing, no backend
- Mova: тільки UA
- Premium, smooth animations, glassmorphism

## Architecture
- Frontend only: React + Three.js + Vanilla CSS (Tailwind retained for utility classes)
- No backend, no MongoDB, no API calls
- Components in `/app/frontend/src/components/atlas/`:
  - `EnergySphere.jsx` — Three.js icosahedron + custom shader (3D simplex noise displacement, fresnel rim glow, particles, wireframe halo, mouse parallax)
  - `Navbar.jsx` — sticky glass nav with scroll-aware blur
  - `Hero.jsx` — sphere centered at top, gradient title, CTA
  - `LivingIntelligence.jsx` — 2-col layout + animated SVG neural web
  - `MacOSControl.jsx` — 3 glassmorphism cards w/ Mac-style window dots
  - `SmartConcierge.jsx` — horizontal carousel w/ scroll snap (6 cards: транспорт, доставка, готелі, квитки, послуги, авіа)
  - `AbsoluteAwareness.jsx` — FaceID orb visual (animated SVG rings + dots + scan line)
  - `FinalCTA.jsx` — closing gradient card w/ "Скоро" CTA
  - `Footer.jsx`
  - `ComingSoonModal.jsx` — accessible modal triggered by all CTAs
  - `useScrollReveal.js` — IntersectionObserver hook for scroll-triggered reveals

## What's been implemented (2025-12)
- [x] Hero with 3D Three.js pulsing energy sphere
- [x] Gradient/shimmer title, eyebrow badge, two CTAs
- [x] Living Intelligence: neural SVG web w/ pulsing nodes + dashed dash-array animation
- [x] macOS Control: 3 glass cards (Керування Mac, Робота з програмами, Безпека)
- [x] Smart Concierge: 6-card horizontal carousel w/ prev/next buttons
- [x] Absolute Awareness: FaceID-style orb (concentric animated rings, dot pattern, scan line)
- [x] Final CTA card w/ ambient gradients
- [x] Coming Soon modal (esc-closes, click-outside, accessible)
- [x] Scroll-reveal via IntersectionObserver
- [x] Glassmorphism utility (.glass), shimmer text, pulse rings, grid overlay
- [x] Full responsive (mobile-first, .two-col breakpoint at 900px)
- [x] data-testid on all interactive + critical elements
- [x] Custom scrollbar gradient, smooth in-app anchor nav

## Backlog (P1/P2)
- P1: Localization toggle (UA/EN)
- P1: Email waitlist (would require minimal FastAPI + Mongo)
- P2: Pricing / FAQ sections
- P2: Embedded product demo video
- P2: SEO meta + OG image

## Test Credentials
N/A (no auth in this static landing)
