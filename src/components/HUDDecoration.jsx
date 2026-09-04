import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setSoundEnabled, getSoundEnabled, playSelectSound, playHoverSound } from "../utils/sound";
import { gameState } from "../utils/gameState";

const hudBtnStyle = {
  background: "rgba(22, 22, 28, 0.85)",
  border: "1px solid var(--border-mid)",
  color: "#e4e4e7",
  fontFamily: "var(--font-mono)",
  fontSize: "0.62rem",
  fontWeight: 600,
  padding: "2px 8px",
  cursor: "pointer",
  borderRadius: "2px",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  transition: "all var(--transition-fast)"
};

export default function HUDDecoration({
  onOpenInventory,
  onOpenRadio,
  onOpenTerminal,
  onOpenAchievements
}) {
  const [soundOn, setSoundOn] = useState(() => getSoundEnabled());
  const [time, setTime] = useState("");
  const [st, setSt] = useState(gameState.state);

  useEffect(() => {
    const unsub = gameState.subscribe((newState) => {
      setSt(newState);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    playSelectSound();
  };

  const handleToggleTheme = () => {
    if (st.isVioletUnlocked) {
      gameState.setTheme(st.activeTheme === "violet" ? "red" : "violet");
    }
  };

  return (
    <>
      {/* Fixed Cyber Scanlines & Grid */}
      <div className="cyber-scanlines" />
      <div className="cyber-grid-bg" />

      {/* Top HUD Telemetry & Quick-Tools Bar (Desktop only, 0 overlap with Navbar below) */}
      <header
        className="hud-top-telemetry hide-mobile"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "36px",
          background: "rgba(8, 8, 8, 0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border-subtle)",
          zIndex: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          fontSize: "0.7rem",
          fontFamily: "var(--font-mono)",
          color: "var(--text-dim)"
        }}
      >
        {/* Left: System Status Telemetry */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00ff66",
                boxShadow: "0 0 6px #00ff66"
              }}
            />
            <strong style={{ color: "var(--text-primary)" }}>ONLINE</strong>
          </span>
          <span>NODE: IN-DEL-01</span>
          <span>SYS_BUILD: 2026.09</span>
        </div>

        {/* Center: Tactical Quick-Tools (Cleanly placed in the top bar with 0 overlap!) */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.62rem", color: "var(--accent-red-bright)", fontWeight: 700, letterSpacing: "0.08em", marginRight: "2px" }}>
            TOOLS //
          </span>
          <button
            type="button"
            onClick={onOpenInventory}
            onMouseEnter={playHoverSound}
            data-cursor="INVENTORY"
            style={hudBtnStyle}
            title="Open Tactical Inventory"
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent-red)"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-mid)"; e.currentTarget.style.color = "#e4e4e7"; }}
          >
            🎒 INVENTORY
          </button>
          <button
            type="button"
            onClick={onOpenRadio}
            onMouseEnter={playHoverSound}
            data-cursor="RADIO"
            style={hudBtnStyle}
            title="Open SV Radio"
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent-red)"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-mid)"; e.currentTarget.style.color = "#e4e4e7"; }}
          >
            📻 RADIO
          </button>
          <button
            type="button"
            onClick={onOpenTerminal}
            onMouseEnter={playHoverSound}
            data-cursor="TERMINAL"
            style={hudBtnStyle}
            title="Open Developer Terminal"
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent-red)"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-mid)"; e.currentTarget.style.color = "#e4e4e7"; }}
          >
            ⌨️ TERMINAL
          </button>
          <button
            type="button"
            onClick={onOpenAchievements}
            onMouseEnter={playHoverSound}
            data-cursor="AWARDS"
            style={hudBtnStyle}
            title="Open Tactical Milestones & Awards"
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--accent-red)"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-mid)"; e.currentTarget.style.color = "#e4e4e7"; }}
          >
            🏆 MILESTONES
          </button>

          {st.isVioletUnlocked && (
            <button
              type="button"
              onClick={handleToggleTheme}
              onMouseEnter={playHoverSound}
              data-cursor="THEME"
              style={{
                ...hudBtnStyle,
                borderColor: "#a855f7",
                color: "#d8b4fe"
              }}
              title="Switch Visual Protocol"
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#c084fc"; e.currentTarget.style.color = "#fff"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#a855f7"; e.currentTarget.style.color = "#d8b4fe"; }}
            >
              {st.activeTheme === "violet" ? "💜 VIOLET" : "🔴 RED"}
            </button>
          )}
        </div>

        {/* Right: Realtime Clock & Sound Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span>{time} UTC</span>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            data-cursor="AUDIO"
            title="Toggle synthesized tactical UI sound"
            style={{
              background: soundOn ? "var(--accent-red-subtle)" : "transparent",
              border: `1px solid ${soundOn ? "var(--accent-red)" : "var(--border-mid)"}`,
              color: soundOn ? "var(--accent-red-bright)" : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "2px 8px",
              fontSize: "0.68rem",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
          >
            {soundOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span>{soundOn ? "[ AUDIO: ON ]" : "[ AUDIO: OFF ]"}</span>
          </button>
        </div>
      </header>
    </>
  );
}
