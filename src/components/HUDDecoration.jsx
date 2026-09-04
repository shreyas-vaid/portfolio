import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setSoundEnabled, getSoundEnabled, playSelectSound } from "../utils/sound";

export default function HUDDecoration() {
  const [soundOn, setSoundOn] = useState(() => getSoundEnabled());
  const [time, setTime] = useState("");

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

  return (
    <>
      {/* Fixed Cyber Scanlines & Grid */}
      <div className="cyber-scanlines" />
      <div className="cyber-grid-bg" />

      {/* Top HUD Telemetry Bar (Desktop only, hidden on mobile for clean viewport) */}
      <header
        className="hud-top-telemetry hide-mobile"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "36px",
          background: "rgba(8, 8, 8, 0.85)",
          backdropFilter: "blur(8px)",
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
          <span className="hide-mobile">NODE: IN-DEL-01</span>
          <span className="hide-mobile">SYS_BUILD: 2026.09</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span className="hide-mobile">{time} UTC</span>

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
