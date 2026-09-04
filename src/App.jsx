import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";

// Components
import BootScreen from "./components/BootScreen";
import CustomCursor from "./components/CustomCursor";
import HUDDecoration from "./components/HUDDecoration";
import Navbar from "./components/Navbar";
import InteractiveCharacter from "./components/InteractiveCharacter/InteractiveCharacter";
import Footer from "./components/Footer";

// Game Layer Components
import GameHUD from "./components/GameHUD/GameHUD";
import InventoryModal from "./components/Inventory/InventoryModal";
import RadioModal from "./components/Radio/RadioModal";
import TerminalModal from "./components/Terminal/TerminalModal";
import AchievementsModal from "./components/Achievements/AchievementsModal";
import SecretThemeBanner from "./components/ThemeOverride/SecretThemeBanner";

// Game State Engine
import { gameState } from "./utils/gameState";

// Sections
import Hero from "./sections/Hero";
import Identity from "./sections/Identity";
import Abilities from "./sections/Abilities";
import Quests from "./sections/Quests";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";

const SECTIONS = ["hero", "identity", "abilities", "quests", "experience", "achievements", "contact"];

function App() {
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
    <div className="app-root">
      {/* Boot Experience */}
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

      {/* HUD Telemetry & Audio Controller */}
      <HUDDecoration />

      {/* Desktop Tactical Quick-Tools Strip */}
      <GameHUD
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

export default App;