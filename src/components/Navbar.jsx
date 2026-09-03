import { useState } from "react";
import { Menu, X } from "lucide-react";
import { playHoverSound, playSelectSound } from "../utils/sound";

const NAV_ITEMS = [
  { id: "hero", number: "01", label: "PROFILE" },
  { id: "identity", number: "02", label: "IDENTITY" },
  { id: "abilities", number: "03", label: "ABILITIES" },
  { id: "quests", number: "04", label: "QUESTS" },
  { id: "experience", number: "05", label: "EXPERIENCE" },
  { id: "achievements", number: "06", label: "ACHIEVEMENTS" },
  { id: "contact", number: "07", label: "CONTACT" }
];

export default function Navbar({ activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    playSelectSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: "36px", // right below HUD bar
          left: 0,
          right: 0,
          height: "64px",
          background: "rgba(13, 13, 13, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          zIndex: 75
        }}
      >
        {/* Brand / Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          onMouseEnter={playHoverSound}
          data-cursor="HOME"
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "var(--accent-red)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "0.85rem",
              fontFamily: "var(--font-display)",
              color: "#fff",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)"
            }}
          >
            SV
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "0.08em",
                color: "#ffffff",
                lineHeight: 1
              }}
            >
              SHREYAS VAID
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                color: "var(--accent-red-bright)",
                letterSpacing: "0.15em",
                marginTop: "2px"
              }}
            >
              LVL 21 // DEV_PROFILE
            </div>
          </div>
        </button>

        {/* Desktop JRPG Nav Items */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={playHoverSound}
                data-cursor="GO"
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  cursor: "pointer",
                  padding: "6px 4px",
                  position: "relative",
                  transition: "all var(--transition-fast)"
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: isActive ? "var(--accent-red)" : "var(--text-dim)",
                    fontWeight: 700
                  }}
                >
                  {item.number}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.82rem",
                    letterSpacing: "0.1em",
                    color: isActive ? "#ffffff" : "var(--text-muted)",
                    fontWeight: isActive ? 700 : 500,
                    transition: "color var(--transition-fast)"
                  }}
                >
                  {item.label}
                </span>

                {/* Active Underline Indicator */}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "var(--accent-red)",
                      boxShadow: "0 0 8px var(--accent-red)"
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => {
            playSelectSound();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="show-mobile-only"
          data-cursor="MENU"
          aria-label="Toggle navigation menu"
          style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border-mid)",
            color: "var(--text-primary)",
            padding: "8px",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            top: "100px",
            background: "rgba(8, 8, 8, 0.98)",
            backdropFilter: "blur(16px)",
            zIndex: 74,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2rem"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #1a1a1a",
                  padding: "12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "left",
                  cursor: "pointer"
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: "var(--accent-red)",
                    fontWeight: 700
                  }}
                >
                  {item.number}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    color: "#ffffff",
                    letterSpacing: "0.08em",
                    fontWeight: 700
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #222",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--text-dim)"
            }}
          >
            STATUS: ONLINE // TAP SECTION TO ACCESS
          </div>
        </div>
      )}
    </>
  );
}
