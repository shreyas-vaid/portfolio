import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import "../../App.css";
import "./kageHybrid.css";

// 40% Kage Layer Component
import KageBackground from "./KageBackground";

// 60% Existing Portfolio Components (Unchanged Core Foundation)
import BootScreen from "../../components/BootScreen";
import CustomCursor from "../../components/CustomCursor";
import HUDDecoration from "../../components/HUDDecoration";
import Navbar from "../../components/Navbar";
import InteractiveCharacter from "../../components/InteractiveCharacter/InteractiveCharacter";
import Footer from "../../components/Footer";

// Existing Game Layer Components & Modals
import InventoryModal from "../../components/Inventory/InventoryModal";
import RadioModal from "../../components/Radio/RadioModal";
import TerminalModal from "../../components/Terminal/TerminalModal";
import AchievementsModal from "../../components/Achievements/AchievementsModal";
import SecretThemeBanner from "../../components/ThemeOverride/SecretThemeBanner";

// Game State Engine
import { gameState } from "../../utils/gameState";

// Existing Sections
import Hero from "../../sections/Hero";
import Identity from "../../sections/Identity";
import Abilities from "../../sections/Abilities";
import Quests from "../../sections/Quests";
import Experience from "../../sections/Experience";
import Achievements from "../../sections/Achievements";
import Contact from "../../sections/Contact";

const SECTIONS = ["hero", "identity", "abilities", "quests", "experience", "achievements", "contact"];

export default function KageHybridApp({ onExitExperiment }) {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Game Modals State
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isThemeBannerOpen, setIsThemeBannerOpen] = useState(false);

  // Initialize theme from saved state
  useEffect(() => {
    gameState.setTheme(gameState.state.activeTheme || "red");
  }, []);

  // Track active section for navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-root kage-hybrid-root">
      {/* Kage Experiment Safety & Telemetry Top Banner */}
      <aside className="kage-experiment-top-banner">
        <div className="kage-banner-left">
          <span>⛩️ [ EXPERIMENTAL 60/40 HYBRID: SHREYAS VAID × 什雷亚斯 ]</span>
          <span className="hide-mobile" style={{ opacity: 0.8 }}>// ROUTE: /kage-test</span>
        </div>
        <div className="kage-banner-right">
          <a
            href="/"
            onClick={(e) => {
              if (onExitExperiment) {
                e.preventDefault();
                onExitExperiment();
              }
            }}
            className="kage-banner-btn"
          >
            <ArrowLeft size={12} />
            <span>[ RETURN TO STANDARD PORTFOLIO ]</span>
          </a>
        </div>
      </aside>

      {/* 40% Kage Three.js WebGL & Atmospheric Mist Layer with 什雷亚斯 Identity */}
      <KageBackground activeSection={activeSection} />

      {/* 60% Existing Portfolio: Boot Experience */}
      <AnimatePresence>
        {!bootComplete && (
          <BootScreen onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      {/* Desktop Custom Reticle Cursor */}
      <CustomCursor />

      {/* Cinematic Secret Theme Unlock Overlay */}
      <SecretThemeBanner
        isOpen={isThemeBannerOpen}
        onClose={() => setIsThemeBannerOpen(false)}
      />

      {/* HUD Telemetry & Desktop Tactical Quick-Tools Bar */}
      <HUDDecoration
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenRadio={() => setIsRadioOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
      />

      {/* JRPG Sticky Navigation Menu & Mobile Drawer */}
      <Navbar
        activeSection={activeSection}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenRadio={() => setIsRadioOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
      />

      {/* Interactive Chibi Character Companion (SV-01) */}
      <InteractiveCharacter activeSection={activeSection} />

      {/* Main Tactical Layout: 60% Existing Portfolio UI */}
      <main className="main-content-layout" style={{ position: "relative", zIndex: 10 }}>
        {/* HERO */}
        <Hero />

        {/* IDENTITY */}
        <Identity />

        {/* ABILITIES / SKILLFORGE (100% Unaltered RPG System) */}
        <Abilities />

        {/* QUESTS / PROJECTS */}
        <Quests />

        {/* EXPERIENCE */}
        <Experience />

        {/* ACHIEVEMENTS */}
        <Achievements />

        {/* CONTACT */}
        <Contact />
      </main>

      {/* Interactive Modals */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />

      <RadioModal
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
      />

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onTriggerThemeUnlock={() => setIsThemeBannerOpen(true)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      {/* Cyber Editorial Minimal Footer */}
      <Footer />
    </div>
  );
}
