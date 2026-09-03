import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playHoverSound } from "../utils/sound";

export default function SkillCard({ skill }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverSound();
      }}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="INSPECT"
      style={{
        background: "var(--bg-panel)",
        border: `1px solid ${isHovered ? "var(--accent-red)" : "var(--border-subtle)"}`,
        padding: "1.25rem",
        position: "relative",
        transition: "all var(--transition-fast)",
        cursor: "pointer",
        minHeight: "135px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
      className="chamfer-sm"
    >
      <div>
        {/* Top meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--accent-red-bright)",
              letterSpacing: "0.1em"
            }}
          >
            {skill.category}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              fontWeight: 700
            }}
          >
            {skill.level}%
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: isHovered ? "#ffffff" : "var(--text-primary)",
            letterSpacing: "0.04em",
            marginBottom: "0.75rem"
          }}
        >
          {skill.name}
        </div>
      </div>

      {/* Level Gauge Bar */}
      <div>
        <div style={{ height: "4px", background: "#222", position: "relative", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              background: isHovered ? "var(--accent-red-bright)" : "var(--accent-red)",
              boxShadow: isHovered ? "0 0 10px var(--accent-red)" : "none"
            }}
          />
        </div>

        {/* Hover / Tap Revealed Sub-abilities Panel */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.5rem",
                borderTop: "1px dashed var(--border-mid)",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px"
              }}
            >
              {skill.abilities.map((ability) => (
                <span
                  key={ability}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    background: "rgba(255, 0, 60, 0.12)",
                    color: "#fff",
                    border: "1px solid rgba(255, 0, 60, 0.3)",
                    padding: "2px 6px"
                  }}
                >
                  {ability}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
