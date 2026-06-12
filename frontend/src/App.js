import { useState, useEffect } from "react";
import "./App.css";
import CustomCursor from "./components/CustomCursor";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import LenisScroll from "./components/LenisScroll";
import useBentoGlow from "./hooks/useBentoGlow";
import useLocalizedNavigate from "./hooks/useLocalizedNavigate";

import Navbar from "./components/atlas/Navbar";
import Hero from "./components/atlas/Hero";
import BentoFeatures from "./components/atlas/BentoFeatures";
import HowItWorks from "./components/atlas/HowItWorks";
import AtlasComparison from "./components/atlas/AtlasComparison";
import FinalCTA from "./components/atlas/FinalCTA";
import Footer from "./components/atlas/Footer";
import AtlasSEOContent from "./components/atlas/AtlasSEOContent";
import useScrollReveal from "./components/atlas/useScrollReveal";

import { AuthProvider } from "./lib/auth";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Docs = lazy(() => import("./pages/Docs"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Careers = lazy(() => import("./pages/Careers"));
const Investors = lazy(() => import("./pages/Investors"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const DocsPost = lazy(() => import("./pages/DocsPost"));
const InviteHandler = lazy(() => import("./pages/InviteHandler"));
const Pricing = lazy(() => import("./pages/Pricing"));



function Landing() {
  const navigate = useLocalizedNavigate();
  const rootRef = useScrollReveal();
  useBentoGlow();

  const handleCtaClick = (eventName) => {
    // Fire tracking event asynchronously without blocking navigation
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: eventName, metadata: { source: "landing" } })
    }).catch(e => console.error("Tracking error:", e));
    
    // Navigate to login
    navigate("/login");
  };

  return (
    <div className="App" ref={rootRef} data-testid="atlas-landing">
      <Navbar onCta={() => handleCtaClick("download_macos_navbar_click")} />
      <Hero onCta={() => handleCtaClick("download_macos_hero_click")} />
      <BentoFeatures />
      <HowItWorks />
      <AtlasComparison />
      <FinalCTA onCta={() => handleCtaClick("download_macos_finalcta_click")} />
      {/* SEO content preserved in DOM (collapsed tabs) for indexing */}
      <AtlasSEOContent />
      <Footer />
    </div>
  );
}

const PageLoader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000", color: "#f5f5f7", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(245, 245, 247, 0.1)", borderTopColor: "#f5f5f7", animation: "spin 0.9s linear infinite" }}></div>
      <span style={{ fontSize: 13, letterSpacing: "0.03em", opacity: 0.6 }}>Завантаження...</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="docs" element={<Docs />} />
      <Route path="docs/:slug" element={<DocsPost />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="terms" element={<Terms />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="careers" element={<Careers />} />
      <Route path="investors" element={<Investors />} />
      <Route path="team" element={<Careers />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="blog" element={<BlogList />} />
      <Route path="blog/:slug" element={<BlogPost />} />
      <Route path="invite/:code" element={<InviteHandler />} />
      <Route path="auth/callback" element={<AuthCallback />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="x7k9m-admin"
        element={
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function LanguageWrapper({ children }) {
  const { i18n } = useTranslation();
  const location = useLocation();
  
  const isEn = location.pathname === "/en" || location.pathname.startsWith("/en/");
  const targetLang = isEn ? "en" : "uk";

  useEffect(() => {
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
  }, [targetLang, i18n]);

  const title = isEn 
    ? "Atlas AI — Autonomous AI Agent & Personal Assistant for macOS" 
    : "Atlas AI — Автономний ШІ Асистент та Розумний Помічник для macOS";
  const desc = isEn
    ? "Download a secure offline AI assistant for sensitive data mac. Build a local knowledge base AI tool offline to automate workflows and control macOS via Telegram."
    : "Завантажте персональний автономний штучний інтелект для макбук. Локальна база знань ШІ без інтернету для повної безпеки конфіденційних даних та автоматизації рутини на macOS.";

  let basePath = location.pathname.replace(/^\/en(\/|$)/, "/");
  if (!basePath.startsWith("/")) basePath = "/" + basePath;
  
  const urlUk = `https://atlas-assistant.online${basePath === "/" ? "" : basePath}`;
  const urlEn = `https://atlas-assistant.online/en${basePath === "/" ? "" : basePath}`;
  const currentUrl = isEn ? urlEn : urlUk;

  return (
    <>
      <Helmet>
        <html lang={isEn ? "en" : "uk"} />
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content="https://atlas-assistant.online/og-image.jpg" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://atlas-assistant.online/og-image.jpg" />
        <link rel="canonical" href={currentUrl} />
        <link rel="alternate" hreflang="uk" href={urlUk} />
        <link rel="alternate" hreflang="en" href={urlEn} />
        <link rel="alternate" hreflang="x-default" href={urlUk} />
      </Helmet>
      {children}
    </>
  );
}

function AppRouter() {
  const location = useLocation();

  // Force scroll to top on route change
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Give DOM a tick to render new components, then refresh ScrollTrigger
    const timeout = setTimeout(() => {
      import("gsap/ScrollTrigger").then((module) => {
        module.default.refresh();
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <LanguageWrapper>
        <Routes>
          <Route path="/en/*" element={<AppRoutes />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </LanguageWrapper>
    </Suspense>
  );
}

import CookieBanner from "./components/CookieBanner";

function App() {
  return (
    <LenisScroll>
      <BrowserRouter>
        <AuthProvider>
          <CustomCursor />
          <AppRouter />
          <CookieBanner />
        </AuthProvider>
      </BrowserRouter>
    </LenisScroll>
  );
}

export default App;
