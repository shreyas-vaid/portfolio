import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, AlertTriangle, Star } from "lucide-react";
import { GithubIcon } from "./SocialIcons";
import { playHoverSound, playSelectSound } from "../utils/sound";

export default function QuestModal({ quest, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        playSelectSound();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!quest) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSelectSound();
            onClose();
          }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5, 5, 5, 0.88)",
            backdropFilter: "blur(8px)"
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "760px",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "var(--bg-surface)",
            border: "1px solid var(--accent-red)",
            boxShadow: "0 0 50px rgba(255, 0, 60, 0.2)",
            padding: "2.25rem",
            color: "var(--text-primary)"
          }}
          className="chamfer-sm"
        >
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-br" />

          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "1rem",
              marginBottom: "1.5rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  color: "var(--accent-red)",
                  fontWeight: 700
                }}
              >
                [{quest.questCode}]
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  background: "var(--bg-panel)",
                  padding: "3px 8px",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                MISSION DOSSIER
              </span>
            </div>

            <button
              onClick={() => {
                playSelectSound();
                onClose();
              }}
              onMouseEnter={playHoverSound}
              data-cursor="CLOSE"
              style={{
                background: "transparent",
                border: "1px solid var(--border-mid)",
                color: "var(--text-muted)",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all var(--transition-fast)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-red)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border-mid)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Title & XP */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.15
                }}
              >
                {quest.title}
              </h2>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  color: "var(--accent-red-bright)",
                  marginTop: "4px"
                }}
              >
                // {quest.subtitle}
              </div>
            </div>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "#00ff66",
                fontWeight: 700,
                background: "rgba(0, 255, 102, 0.1)",
                border: "1px solid rgba(0, 255, 102, 0.3)",
                padding: "4px 10px",
                whiteSpace: "nowrap"
              }}
            >
              {quest.xp}
            </span>
          </div>

          {/* Overview / Summary */}
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginTop: "1.25rem",
              marginBottom: "1.75rem"
            }}
          >
            {quest.summary}
          </p>

          {/* Problem & Solution Panels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "1.75rem"
            }}
          >
            {/* Problem */}
            <div
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-subtle)",
                padding: "1.25rem"
              }}
              className="chamfer-sm"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--accent-red)",
                  fontWeight: 700,
                  marginBottom: "0.5rem"
                }}
              >
                <AlertTriangle size={14} />
                <span>CHALLENGE / PROBLEM</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {quest.problem}
              </p>
            </div>

            {/* Solution */}
            <div
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-subtle)",
                padding: "1.25rem"
              }}
              className="chamfer-sm"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "#00ff66",
                  fontWeight: 700,
                  marginBottom: "0.5rem"
                }}
              >
                <CheckCircle2 size={14} />
                <span>ENGINEERING SOLUTION</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                {quest.solution}
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem"
              }}
            >
              KEY TACTICAL CAPABILITIES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {quest.keyFeatures.map((feat, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    fontSize: "0.85rem",
                    color: "var(--text-primary)"
                  }}
                >
                  <span style={{ color: "var(--accent-red)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    0{i + 1}.
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem"
              }}
            >
              TECH STACK MATRIX
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {quest.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    background: "var(--bg-panel)",
                    border: "1px solid var(--border-mid)",
                    color: "#ffffff",
                    padding: "4px 10px"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Working Action Links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "1.5rem"
            }}
          >
            {quest.liveUrl && (
              <a
                href={quest.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="LAUNCH"
                className="btn-cyber-primary"
                style={{ flex: "1 1 auto" }}
              >
                <ExternalLink size={16} />
                <span>LAUNCH LIVE DEMO</span>
              </a>
            )}

            {quest.githubUrl && (
              <a
                href={quest.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="CODE"
                className="btn-cyber-secondary"
                style={{ flex: "1 1 auto" }}
              >
                <GithubIcon size={16} />
                <span>INSPECT REPOSITORY</span>
              </a>
            )}

            <button
              onClick={() => {
                playSelectSound();
                onClose();
              }}
              className="btn-cyber-secondary"
              style={{ flex: "0 1 auto" }}
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
