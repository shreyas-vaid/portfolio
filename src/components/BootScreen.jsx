import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playConfirmSound, playHoverSound } from "../utils/sound";
import { gameState } from "../utils/gameState";

const BOOT_LINES = [
  "SYSTEM INITIALIZING...",
  "LOADING DEVELOPER PROFILE........ OK",
  "LOADING ABILITY MATRIX.......... OK",
  "LOADING QUEST DATABASE.......... OK",
  "LOADING EXPERIENCE.............. OK",
  "LOADING ACHIEVEMENTS............ OK",
  "IDENTITY VERIFIED // PROTOCOL_V2"
];

const LOADING_TIPS = [
  "TACTICAL INTEL: SV-01 Companion in the bottom corner is trained on Shreyas's tech stack, experience, and projects.",
  "PRO-TIP: Discover secret terminal commands like 'theme violet' and 'sudo coffee' in the Developer Terminal.",
  "FIELD NOTE: Check the Quests sector to inspect full-stack API architectures, live demos, and GitHub code.",
  "SYSTEM ARCHITECTURE: Built with React, Vite, Framer Motion, and synthesized Web Audio."
];

export default function BootScreen({ onComplete }) {
  const isReturning = gameState.state.visitCount > 1;
  const [currentStep, setCurrentStep] = useState(isReturning ? BOOT_LINES.length : 0);
  const isDone = isReturning || currentStep >= BOOT_LINES.length;

  // Game Loading Screen Transition State
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);
  const [loadingPct, setLoadingPct] = useState(0);
  const [loadingStage, setLoadingStage] = useState("INITIALIZING RENDER PIPELINE...");
  const [activeTip, setActiveTip] = useState(0);

  useEffect(() => {
    if (!isReturning && currentStep < BOOT_LINES.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isReturning]);

  const handleEnter = useCallback(() => {
    if (isLoadingTransition) return;
    playConfirmSound();
    setIsLoadingTransition(true);
    setActiveTip(Math.floor(Math.random() * LOADING_TIPS.length));

    // Realistic multi-stage game loading sequence
    const stages = [
      { pct: 28, text: "MOUNTING AUDIO ENGINE & SYNTHESIZERS..." },
      { pct: 58, text: "PARSING ABILITY MATRICES & QUEST LOGS..." },
      { pct: 86, text: "DEPLOYING SV-01 TACTICAL COMPANION..." },
      { pct: 100, text: "WORLD RENDER READY // ACCESS GRANTED" }
    ];

    let currentStageIdx = 0;

    const interval = setInterval(() => {
      setLoadingPct((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= stages[currentStageIdx]?.pct && currentStageIdx < stages.length - 1) {
          currentStageIdx++;
          setLoadingStage(stages[currentStageIdx].text);
        }

        if (next >= 100) {
          clearInterval(interval);
          setLoadingStage(stages[stages.length - 1].text);
          setTimeout(() => {
            gameState.unlockAchievement("ach-exp-init", "FIRST CONTACT");
            onComplete();
          }, 280);
          return 100;
        }
        return next;
      });
    }, 45);

  }, [isLoadingTransition, onComplete]);

  // Handle keyboard shortcut Esc or Enter to skip / enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        gameState.unlockAchievement("ach-exp-init", "FIRST CONTACT");
        onComplete();
      } else if (isDone && e.key === "Enter" && !isLoadingTransition) {
        handleEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDone, isLoadingTransition, handleEnter, onComplete]);

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

      {/* Game Loading Screen Transition View */}
      {isLoadingTransition ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.2 }}
          style={{
            width: "100%",
            maxWidth: "680px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            zIndex: 2,
            padding: "1rem"
          }}
        >
          {/* Top Mission Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.72rem",
              color: "var(--text-dim)",
              borderBottom: "1px solid rgba(255, 0, 60, 0.25)",
              paddingBottom: "0.6rem"
            }}
          >
            <span style={{ color: "var(--accent-red-bright)", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff003c", boxShadow: "0 0 8px #ff003c" }} />
              MISSION // ENTERING WORLD MATRIX
            </span>
            <span style={{ color: "var(--text-muted)" }}>SECTOR: DELHI-NCR // SV-01</span>
          </div>

          {/* Center Operative Banner */}
          <div
            style={{
              background: "rgba(13, 13, 16, 0.95)",
              border: "1px solid var(--border-mid)",
              padding: "1.75rem 2rem",
              boxShadow: "0 0 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 0, 60, 0.2)",
              textAlign: "center",
              position: "relative"
            }}
            className="chamfer-sm"
          >
            <div className="corner-bracket-tl" />
            <div className="corner-bracket-br" />

            <div
              style={{
                width: "44px",
                height: "44px",
                margin: "0 auto 1rem",
                background: "var(--accent-red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.2rem",
                fontFamily: "var(--font-display)",
                color: "#ffffff",
                boxShadow: "0 0 20px rgba(255, 0, 60, 0.6)",
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)"
              }}
            >
              SV
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "0.08em"
              }}
            >
              SHREYAS VAID
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--accent-red-bright)",
                letterSpacing: "0.2em",
                marginTop: "0.25rem",
                fontWeight: 600
              }}
            >
              DEVELOPER & ANALYST // READY FOR DEPLOYMENT
            </div>

            {/* Stage Text */}
            <div
              style={{
                marginTop: "1.75rem",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <span style={{ color: "var(--accent-red)" }}>▶</span>
              <span>{loadingStage}</span>
            </div>

            {/* Segmented Loading Bar */}
            <div
              style={{
                marginTop: "0.75rem",
                width: "100%",
                height: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--accent-red)",
                padding: "2px",
                position: "relative",
                boxShadow: "0 0 14px rgba(255, 0, 60, 0.25)"
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  width: `${loadingPct}%`,
                  background: "linear-gradient(90deg, #800018, #ff003c, #ff2a55)",
                  boxShadow: "0 0 10px #ff003c",
                  transition: "width 0.08s ease"
                }}
              />
            </div>

            {/* Percentage & Data Metres */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.5rem",
                fontSize: "0.68rem",
                fontFamily: "var(--font-mono)",
                color: "var(--text-dim)"
              }}
            >
              <span>DATA STREAM: {Math.round(loadingPct * 1.48)} / 148 KB</span>
              <span style={{ color: "#ffffff", fontWeight: 700, letterSpacing: "0.05em" }}>
                {loadingPct}%
              </span>
            </div>
          </div>

          {/* Rotating Game Loading Tip Card */}
          <motion.div
            key={activeTip}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(10, 10, 14, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderLeft: "3px solid var(--accent-red)",
              padding: "0.85rem 1.25rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              lineHeight: 1.5
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--accent-red-bright)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                marginBottom: "0.3rem"
              }}
            >
              💡 OPERATIONAL TIP // 0{activeTip + 1}
            </div>
            {LOADING_TIPS[activeTip]}
          </motion.div>
        </motion.div>
      ) : (
        /* Normal Terminal Window */
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
            {isReturning ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ color: "var(--accent-red-bright)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                  ▶ SAVE FILE FOUND // SESSION PRESERVED
                </div>
                <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                  WELCOME BACK.
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  TERMINAL VERIFIED // <strong style={{ color: "#ffffff" }}>SHREYAS VAID PORTFOLIO</strong>
                </div>
                <div style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
                  SYSTEM ONLINE // PROTOCOL ACTIVE
                </div>
              </div>
            ) : (
              <>
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
              </>
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
                  SHREYAS VAID
                </div>
                <div
                  style={{
                    color: "var(--accent-red-bright)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.2em",
                    marginTop: "0.25rem",
                    fontWeight: 600
                  }}
                >
                  DEVELOPER / ANALYST
                </div>

                {/* Enter Button */}
                <button
                  onClick={handleEnter}
                  onMouseEnter={playHoverSound}
                  data-cursor="CLICK"
                  className="chamfer-sm"
                  style={{
                    marginTop: "1.5rem",
                    background: "#ff003c",
                    border: "1px solid #ff2a55",
                    color: "#ffffff",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                    padding: "10px 28px",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(255, 0, 60, 0.4)",
                    transition: "all 0.2s"
                  }}
                >
                  {isReturning ? "[ CONTINUE // ENTER ]" : "[ ENTER SYSTEM ]"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

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
