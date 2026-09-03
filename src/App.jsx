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
import XPToast from "./components/Notifications/XPToast";

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
const SECTION_XP_MAP = {
  hero: 10,
  identity: 10,
  abilities: 10,
  quests: 15,
  experience: 15,
  achievements: 15,
  contact: 10
};

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

  // Track active section and award exploration XP
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i]);
        if (el && el.offsetTop <= scrollPos) {
          const currentSec = SECTIONS[i];
          setActiveSection(currentSec);

          // Award exploration XP once per section
          if (bootComplete) {
            const xp = SECTION_XP_MAP[currentSec] || 10;
            gameState.awardXP(`visit_${currentSec}`, xp, `${currentSec.toUpperCase()} EXPLORED`);

            // Check if all sections have been visited
            const allVisited = SECTIONS.every((s) => gameState.state.completedActions[`visit_${s}`]);
            if (allVisited) {
              gameState.unlockAchievement("ach-exp-explorer", "SYSTEM EXPLORER");
            }
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bootComplete]);

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

      {/* XP & Level Notification Toasts */}
      <XPToast />

      {/* Cinematic Secret Theme Unlock Overlay */}
      <SecretThemeBanner
        isOpen={isThemeBannerOpen}
        onClose={() => setIsThemeBannerOpen(false)}
      />

      {/* HUD Telemetry & Audio Controller */}
      <HUDDecoration />

      {/* Exploration Game System HUD (Rank, XP Bar, Quick Launch Tools) */}
      <GameHUD
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenRadio={() => setIsRadioOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
      />

      {/* JRPG Sticky Navigation Menu */}
      <Navbar activeSection={activeSection} />

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