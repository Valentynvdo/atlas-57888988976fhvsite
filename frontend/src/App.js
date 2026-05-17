import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/atlas/Navbar";
import Hero from "./components/atlas/Hero";
import LivingIntelligence from "./components/atlas/LivingIntelligence";
import MacOSControl from "./components/atlas/MacOSControl";
import SmartConcierge from "./components/atlas/SmartConcierge";
import AbsoluteAwareness from "./components/atlas/AbsoluteAwareness";
import FinalCTA from "./components/atlas/FinalCTA";
import Footer from "./components/atlas/Footer";
import ComingSoonModal from "./components/atlas/ComingSoonModal";
import useScrollReveal from "./components/atlas/useScrollReveal";

import { AuthProvider } from "./lib/auth";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const rootRef = useScrollReveal();

  return (
    <div className="App" ref={rootRef} data-testid="atlas-landing">
      <Navbar onCta={() => setModalOpen(true)} />
      <Hero onCta={() => setModalOpen(true)} />
      <LivingIntelligence />
      <MacOSControl />
      <SmartConcierge />
      <AbsoluteAwareness />
      <FinalCTA onCta={() => setModalOpen(true)} />
      <Footer />
      <ComingSoonModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

function AppRouter() {
  const location = useLocation();
  // CRITICAL — handle OAuth callback FIRST during render, before any ProtectedRoute runs
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
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
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
