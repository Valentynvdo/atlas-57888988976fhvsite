import { useState } from "react";
import "./App.css";
import CustomCursor from "./components/CustomCursor";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import Navbar from "./components/atlas/Navbar";
import Hero from "./components/atlas/Hero";
import AtlasComparison from "./components/atlas/AtlasComparison";
import AtlasLiveThought from "./components/atlas/AtlasLiveThought";
import LivingIntelligence from "./components/atlas/LivingIntelligence";
import MacOSControl from "./components/atlas/MacOSControl";
import SmartConcierge from "./components/atlas/SmartConcierge";
import AbsoluteAwareness from "./components/atlas/AbsoluteAwareness";
import FinalCTA from "./components/atlas/FinalCTA";
import Footer from "./components/atlas/Footer";
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

const MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;

function Landing() {
  const navigate = useNavigate();
  const rootRef = useScrollReveal();

  return (
    <div className="App" ref={rootRef} data-testid="atlas-landing">
      <Navbar onCta={() => navigate("/login")} />
      <Hero onCta={() => navigate("/login")} />
      <AtlasLiveThought />
      <LivingIntelligence />
      <MacOSControl />
      <SmartConcierge />
      <AbsoluteAwareness />
      <AtlasComparison />
      <FinalCTA onCta={() => navigate("/login")} />
      <Footer />
    </div>
  );
}

const PageLoader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#030303", color: "#00E5FF", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(0, 229, 255, 0.1)", borderTopColor: "#00E5FF", animation: "spin 1s linear infinite" }}></div>
      <span style={{ fontSize: 14, letterSpacing: "0.05em", opacity: 0.8 }}>Завантаження...</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

function AppRouter() {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/x7k9m-admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <div className="grain-overlay" />
      <BrowserRouter>
        <AuthProvider>
          <CustomCursor />
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </TonConnectUIProvider>
  );
}

export default App;
