import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playConfirmSound, playHoverSound } from "../utils/sound";

const BOOT_LINES = [
  "SYSTEM INITIALIZING...",
  "LOADING DEVELOPER PROFILE........ OK",
  "LOADING ABILITY MATRIX.......... OK",
  "LOADING QUEST DATABASE.......... OK",
  "LOADING EXPERIENCE.............. OK",
  "LOADING ACHIEVEMENTS............ OK",
  "IDENTITY VERIFIED // PROTOCOL_V2"
];

export default function BootScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const isDone = currentStep >= BOOT_LINES.length;

  useEffect(() => {
    if (currentStep < BOOT_LINES.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleEnter = useCallback(() => {
    playConfirmSound();
    onComplete();
  }, [onComplete]);

  // Handle keyboard shortcut Esc or Enter to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || (isDone && e.key === "Enter")) {
        handleEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDone, handleEnter]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.45, ease: "easeInOut" } }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#080808",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        fontFamily: "var(--font-mono)"
      }}
    >
      {/* Top HUD Metadata */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "2rem",
          right: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "var(--text-dim)",
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: "0.75rem"
        }}
      >
        <span style={{ color: "var(--accent-red)", fontWeight: 700 }}>
          ▶ CLASSIFIED_TERMINAL // BOOT_SEQ
        </span>
        <button
          onClick={handleEnter}
          onMouseEnter={playHoverSound}
          data-cursor="SKIP"
          style={{
            background: "transparent",
            border: "1px solid #333",
            color: "var(--text-muted)",
            fontSize: "0.7rem",
            fontFamily: "var(--font-mono)",
            padding: "4px 12px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => (e.target.style.borderColor = "#ff003c")}
          onMouseOut={(e) => (e.target.style.borderColor = "#333")}
        >
          [ SKIP_BOOT // ESC ]
        </button>
      </div>

      {/* Main Terminal Window */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "#0d0d0d",
          border: "1px solid #222",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.8)",
          position: "relative",
          padding: "2rem 2.5rem"
        }}
        className="chamfer-sm"
      >
        <div className="corner-bracket-tl" />
        <div className="corner-bracket-br" />

        {/* Window Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #1c1c1c",
            paddingBottom: "0.75rem"
          }}
        >
          <div style={{ width: 8, height: 8, background: "#ff003c" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            TERMINAL_AUTH_GATEWAY
          </span>
        </div>

        {/* Lines Sequence */}
        <div style={{ minHeight: "180px" }}>
          {BOOT_LINES.slice(0, currentStep).map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                fontSize: "0.85rem",
                color: idx === BOOT_LINES.length - 1 ? "#ff2a55" : "var(--text-muted)",
                fontWeight: idx === BOOT_LINES.length - 1 ? 700 : 400,
                marginBottom: "0.45rem",
                letterSpacing: "0.05em"
              }}
            >
              <span style={{ color: "#ff003c", marginRight: "8px" }}>&gt;</span>
              {line}
            </motion.div>
          ))}
          {currentStep < BOOT_LINES.length && (
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "14px",
                background: "#ff003c",
                verticalAlign: "middle",
                animation: "blink 0.8s infinite"
              }}
            />
          )}
        </div>

        {/* Verified Character Splash */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #222",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.08em"
                }}
              >
                SHREYAS_VAID
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--accent-red)",
                  letterSpacing: "0.2em",
                  marginBottom: "1.75rem",
                  fontWeight: 600
                }}
              >
                DEVELOPER / CREATOR
              </div>

              <button
                onClick={handleEnter}
                onMouseEnter={playHoverSound}
                data-cursor="ENTER"
                className="btn-cyber-primary"
                style={{ width: "100%", padding: "14px 24px" }}
              >
                [ ENTER SYSTEM ]
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Status */}
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          fontSize: "0.7rem",
          color: "var(--text-dim)",
          letterSpacing: "0.1em"
        }}
      >
        SECURITY LEVEL: MAXIMUM // ENCRYPTION ACTIVE
      </div>
    </motion.div>
  );
}
