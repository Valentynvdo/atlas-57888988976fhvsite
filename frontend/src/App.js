import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
