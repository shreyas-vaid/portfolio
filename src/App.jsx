import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";

// Components
import BootScreen from "./components/BootScreen";
import CustomCursor from "./components/CustomCursor";
import HUDDecoration from "./components/HUDDecoration";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Sections
import Hero from "./sections/Hero";
import Identity from "./sections/Identity";
import Abilities from "./sections/Abilities";
import Quests from "./sections/Quests";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Track active section via IntersectionObserver for navbar highlighting
  useEffect(() => {
    const sections = ["hero", "identity", "abilities", "quests", "experience", "achievements", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-root">
      {/* Boot Experience */}
      <AnimatePresence>
        {!bootComplete && (
          <BootScreen onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      {/* Desktop Custom Reticle Cursor */}
      <CustomCursor />

      {/* HUD Telemetry & Audio Controller */}
      <HUDDecoration />

      {/* JRPG Sticky Navigation Menu */}
      <Navbar activeSection={activeSection} />

      {/* Main Tactical Layout */}
      <main className="main-content-layout">
        <Hero />
        <Identity />
        <Abilities />
        <Quests />
        <Experience />
        <Achievements />
        <Contact />
      </main>

      {/* Cyber Editorial Minimal Footer */}
      <Footer />
    </div>
  );
}

export default App;