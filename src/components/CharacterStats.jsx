import { motion } from "framer-motion";
import { profileData } from "../data/profile";
import { playHoverSound } from "../utils/sound";

export default function CharacterStats() {
  return (
    <div
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border-subtle)",
        padding: "1.75rem",
        position: "relative",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}
      className="chamfer-sm"
    >
      <div className="corner-bracket-tl" />
      <div className="corner-bracket-br" />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "0.85rem",
          marginBottom: "1.25rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 8, height: 8, background: "var(--accent-red)" }} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#ffffff"
            }}
          >
            CHARACTER ABILITY SPECTRUM
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--accent-red-bright)",
            background: "var(--accent-red-subtle)",
            border: "1px solid var(--accent-red)",
            padding: "2px 8px"
          }}
        >
          RPG MATRIX
        </span>
      </div>

      {/* Stat Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {profileData.stats.map((stat, idx) => {
          const isOverflow = stat.overflow && stat.value > stat.max;
          // Cap bar at 100% but show overflow glow; ASCII shows full 10 blocks + pulse
          const displayPct = isOverflow ? 100 : stat.value;
          const filledBlocks = isOverflow ? 10 : Math.round((stat.value / stat.max) * 10);
          const blockBar = isOverflow
            ? "█".repeat(10) + " ◆"
            : "█".repeat(filledBlocks) + "░".repeat(10 - filledBlocks);

          return (
            <div
              key={stat.label}
              onMouseEnter={playHoverSound}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem"
                }}
              >
                <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ color: "var(--accent-red)", fontWeight: 700 }}>[{stat.code}]</span>
                  <strong style={{ color: "var(--text-primary)" }}>{stat.label}</strong>
                  {/* Overflow Perk Badge */}
                  {isOverflow && stat.perk && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        background: "linear-gradient(90deg, rgba(255,0,60,0.25), rgba(255,170,0,0.15))",
                        border: "1px solid rgba(255,170,0,0.6)",
                        color: "#ffaa00",
                        padding: "1px 6px",
                        letterSpacing: "0.08em",
                        fontWeight: 700,
                        animation: "cyber-pulse 2s ease-in-out infinite"
                      }}
                    >
                      ★ {stat.perk}
                    </span>
                  )}
                </span>
                <span
                  style={{
                    color: isOverflow ? "#ffaa00" : "#ffffff",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    textShadow: isOverflow ? "0 0 8px rgba(255,170,0,0.6)" : "none"
                  }}
                >
                  {stat.value}{" "}
                  <span style={{ color: "var(--text-dim)", fontSize: "0.7rem" }}>/ {stat.max}</span>
                </span>
              </div>

              {/* Graphical Bar */}
              <div
                style={{
                  height: "8px",
                  background: "#1a1a1a",
                  position: "relative",
                  overflow: "visible"
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${displayPct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: isOverflow
                      ? "linear-gradient(90deg, #800018 0%, #ff003c 60%, #ffaa00 100%)"
                      : "linear-gradient(90deg, var(--accent-red-dark) 0%, var(--accent-red) 100%)",
                    boxShadow: isOverflow
                      ? "0 0 16px rgba(255,170,0,0.7), 0 0 6px var(--accent-red)"
                      : "0 0 10px var(--accent-red-glow)"
                  }}
                />
              </div>

              {/* ASCII Representation */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: isOverflow ? "#ffaa00" : "var(--text-dim)",
                  letterSpacing: "0.15em",
                  marginTop: "1px"
                }}
              >
                {blockBar}
              </div>
            </div>
          );
        })}
      </div>


      {/* Clear RPG Context Disclaimer */}
      <div
        style={{
          marginTop: "1.25rem",
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--border-subtle)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-dim)",
          lineHeight: 1.4
        }}
      >
        * Values represent stylized character presentation metrics designed for interactive portfolio navigation.
      </div>
    </div>
  );
}
