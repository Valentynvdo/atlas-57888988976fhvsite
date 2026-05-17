import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import Navbar from "./components/atlas/Navbar";
import Hero from "./components/atlas/Hero";
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
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Docs from "./pages/Docs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contacts from "./pages/Contacts";

const MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;

function Landing() {
  const navigate = useNavigate();
  const rootRef = useScrollReveal();

  return (
    <div className="App" ref={rootRef} data-testid="atlas-landing">
      <Navbar onCta={() => navigate("/login")} />
      <Hero onCta={() => navigate("/login")} />
      <LivingIntelligence />
      <MacOSControl />
      <SmartConcierge />
      <AbsoluteAwareness />
      <FinalCTA onCta={() => navigate("/login")} />
      <Footer />
    </div>
  );
}

function AppRouter() {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
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
  );
}

function App() {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </TonConnectUIProvider>
  );
}

export default App;
