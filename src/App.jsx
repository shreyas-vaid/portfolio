import { useState, useEffect, useCallback, memo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import "./experiments/kage-hybrid/kageHybrid.css";

// 3D WebGL Kyoto Temple background & atmospheric mist layer
import KageBackground from "./experiments/kage-hybrid/KageBackground";

// Core Experience Components
import BootScreen from "./components/BootScreen";
import CustomCursor from "./components/CustomCursor";
import HUDDecoration from "./components/HUDDecoration";
import Navbar from "./components/Navbar";
import InteractiveCharacter from "./components/InteractiveCharacter/InteractiveCharacter";
import Footer from "./components/Footer";

// Game Layer Modals & Overlays
import InventoryModal from "./components/Inventory/InventoryModal";
import RadioModal from "./components/Radio/RadioModal";
import TerminalModal from "./components/Terminal/TerminalModal";
import AchievementsModal from "./components/Achievements/AchievementsModal";
import SecretThemeBanner from "./components/ThemeOverride/SecretThemeBanner";

// Game State Engine
import { gameState } from "./utils/gameState";

// Sections (memoized to eliminate waterfall re-renders on scroll / activeSection changes)
import Hero from "./sections/Hero";
import Identity from "./sections/Identity";
import Abilities from "./sections/Abilities";
import Quests from "./sections/Quests";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";

const MemoHero = memo(Hero);
const MemoIdentity = memo(Identity);
const MemoAbilities = memo(Abilities);
const MemoQuests = memo(Quests);
const MemoExperience = memo(Experience);
const MemoAchievements = memo(Achievements);
const MemoContact = memo(Contact);
const MemoFooter = memo(Footer);

const SECTIONS = ["hero", "identity", "abilities", "quests", "experience", "achievements", "contact"];

function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const activeSectionRef = useRef("hero");

  // Game Modals State
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isThemeBannerOpen, setIsThemeBannerOpen] = useState(false);

  // Stable event callbacks for memoized HUD & Navbar
  const handleOpenInventory = useCallback(() => setIsInventoryOpen(true), []);
  const handleCloseInventory = useCallback(() => setIsInventoryOpen(false), []);
  const handleOpenRadio = useCallback(() => setIsRadioOpen(true), []);
  const handleCloseRadio = useCallback(() => setIsRadioOpen(false), []);
  const handleOpenTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const handleCloseTerminal = useCallback(() => setIsTerminalOpen(false), []);
  const handleOpenAchievements = useCallback(() => setIsAchievementsOpen(true), []);
  const handleCloseAchievements = useCallback(() => setIsAchievementsOpen(false), []);
  const handleTriggerThemeUnlock = useCallback(() => setIsThemeBannerOpen(true), []);
  const handleCloseThemeBanner = useCallback(() => setIsThemeBannerOpen(false), []);
  const handleBootComplete = useCallback(() => setBootComplete(true), []);

  // Initialize theme from saved state
  useEffect(() => {
    gameState.setTheme(gameState.state.activeTheme || "red");
  }, []);

  // High-performance RAF-throttled scroll handler for navbar highlighting
  useEffect(() => {
    let rafScrollId = null;

    const checkScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i]);
        if (el && el.offsetTop <= scrollPos) {
          const next = SECTIONS[i];
          if (next !== activeSectionRef.current) {
            activeSectionRef.current = next;
            setActiveSection(next);
          }
          break;
        }
      }
      rafScrollId = null;
    };

    const handleScroll = () => {
      if (!rafScrollId) {
        rafScrollId = requestAnimationFrame(checkScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafScrollId) cancelAnimationFrame(rafScrollId);
    };
  }, []);

  return (
    <div className="app-root kage-hybrid-root">
      {/* 3D WebGL Kyoto Mountain Temple & Atmospheric Mist Layer with 什雷亚斯 Environmental Identity */}
      <KageBackground />

      {/* Boot Experience */}
      <AnimatePresence>
        {!bootComplete && (
          <BootScreen onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {/* Desktop Custom Reticle Cursor */}
      <CustomCursor />

      {/* Cinematic Secret Theme Unlock Overlay */}
      <SecretThemeBanner
        isOpen={isThemeBannerOpen}
        onClose={handleCloseThemeBanner}
      />

      {/* HUD Telemetry & Desktop Tactical Quick-Tools Bar */}
      <HUDDecoration
        onOpenInventory={handleOpenInventory}
        onOpenRadio={handleOpenRadio}
        onOpenTerminal={handleOpenTerminal}
        onOpenAchievements={handleOpenAchievements}
      />

      {/* JRPG Sticky Navigation Menu & Mobile Drawer */}
      <Navbar
        activeSection={activeSection}
        onOpenInventory={handleOpenInventory}
        onOpenRadio={handleOpenRadio}
        onOpenTerminal={handleOpenTerminal}
        onOpenAchievements={handleOpenAchievements}
      />

      {/* Interactive Chibi Character Companion (SV-01) */}
      <InteractiveCharacter activeSection={activeSection} />

      {/* Main Tactical Layout */}
      <main className="main-content-layout" style={{ position: "relative", zIndex: 10 }}>
        {/* HERO */}
        <MemoHero />

        {/* IDENTITY */}
        <MemoIdentity />

        {/* ABILITIES / SKILLFORGE */}
        <MemoAbilities />

        {/* QUESTS / PROJECTS */}
        <MemoQuests />

        {/* EXPERIENCE */}
        <MemoExperience />

        {/* ACHIEVEMENTS */}
        <MemoAchievements />

        {/* CONTACT */}
        <MemoContact />
      </main>

      {/* Interactive Modals */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={handleCloseInventory}
      />

      <RadioModal
        isOpen={isRadioOpen}
        onClose={handleCloseRadio}
      />

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={handleCloseTerminal}
        onTriggerThemeUnlock={handleTriggerThemeUnlock}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={handleCloseAchievements}
      />

      {/* Cyber Editorial Minimal Footer */}
      <MemoFooter />
    </div>
  );
}

export default App;