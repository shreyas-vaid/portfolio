import { useState, useEffect } from "react";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { playHoverSound, playSelectSound, getSoundEnabled, setSoundEnabled } from "../utils/sound";
import { gameState } from "../utils/gameState";
import "./Navbar.css";

const NAV_ITEMS = [
  { id: "hero", number: "01", label: "PROFILE" },
  { id: "identity", number: "02", label: "IDENTITY" },
  { id: "abilities", number: "03", label: "ABILITIES" },
  { id: "quests", number: "04", label: "QUESTS" },
  { id: "experience", number: "05", label: "EXPERIENCE" },
  { id: "achievements", number: "06", label: "ACHIEVEMENTS" },
  { id: "contact", number: "07", label: "CONTACT" }
];

export default function Navbar({
  activeSection,
  onOpenInventory,
  onOpenRadio,
  onOpenTerminal,
  onOpenAchievements
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => getSoundEnabled());
  const [theme, setTheme] = useState(gameState.state.activeTheme || "red");

  useEffect(() => {
    const unsub = gameState.subscribe((st) => {
      setTheme(st.activeTheme);
    });
    return unsub;
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    playSelectSound();
  };

  const handleToggleTheme = () => {
    const next = theme === "violet" ? "red" : "violet";
    gameState.setTheme(next);
  };

  const scrollToSection = (id) => {
    playSelectSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleToolClick = (toolFn) => {
    setMobileMenuOpen(false);
    if (toolFn) toolFn();
  };

  return (
    <>
      <nav className="cyber-nav-container" aria-label="Main Navigation">
        {/* Brand / Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          onMouseEnter={playHoverSound}
          data-cursor="HOME"
          className="cyber-brand-btn"
        >
          <div className="cyber-brand-badge">SV</div>
          <div>
            <div className="cyber-brand-name">SHREYAS VAID</div>
            <div className="cyber-brand-sub">LVL 21 // DEV_PROFILE</div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav-links">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={playHoverSound}
                data-cursor="GO"
                className={`nav-link-btn ${isActive ? "active" : ""}`}
              >
                <span className="nav-link-num">{item.number}</span>
                <span className="nav-link-label">{item.label}</span>
                {isActive && <span className="nav-active-bar" />}
              </button>
            );
          })}
        </div>

        {/* Mobile Header Controls (Sound toggle + Hamburger) */}
        <div className="mobile-header-controls">
          <button
            type="button"
            onClick={toggleSound}
            className={`mobile-icon-btn ${soundOn ? "active" : ""}`}
            aria-label={soundOn ? "Mute audio sound effects" : "Enable tactical audio sound effects"}
            title={soundOn ? "Audio: ON" : "Audio: OFF"}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="mobile-icon-btn"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="cyber-mobile-drawer">
          {/* Section Navigation List */}
          <div className="drawer-nav-list">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="drawer-nav-item"
              >
                <span className="drawer-item-num">{item.number}</span>
                <span className="drawer-item-label">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Tactical Protocols & Tools Panel (Clean mobile home for all interactive features) */}
          <div className="drawer-tactical-card">
            <div className="drawer-card-title">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-red-bright)" }} />
              TACTICAL PROTOCOLS // TOOLS
            </div>
            <div className="drawer-tools-grid">
              <button
                type="button"
                className="drawer-tool-btn"
                onClick={() => handleToolClick(onOpenInventory)}
              >
                🎒 INVENTORY
              </button>
              <button
                type="button"
                className="drawer-tool-btn"
                onClick={() => handleToolClick(onOpenRadio)}
              >
                📻 RADIO
              </button>
              <button
                type="button"
                className="drawer-tool-btn"
                onClick={() => handleToolClick(onOpenTerminal)}
              >
                ⌨️ TERMINAL
              </button>
              <button
                type="button"
                className="drawer-tool-btn"
                onClick={() => handleToolClick(onOpenAchievements)}
              >
                🏆 MILESTONES
              </button>

              {gameState.state.isVioletUnlocked && (
                <button
                  type="button"
                  className="drawer-tool-btn theme-btn"
                  onClick={handleToggleTheme}
                  style={{ gridColumn: "span 2" }}
                >
                  {theme === "violet" ? "💜 VIOLET THEME (ACTIVE)" : "🔴 SWITCH TO VIOLET"}
                </button>
              )}
            </div>
          </div>

          {/* Drawer Footer Status */}
          <div className="drawer-footer-status">
            <span>● STATUS: ONLINE</span>
            <span>NODE: IN-DEL-01</span>
          </div>
        </div>
      )}
    </>
  );
}

