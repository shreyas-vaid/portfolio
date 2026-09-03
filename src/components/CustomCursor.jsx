import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  });

  useEffect(() => {
    if (isTouchDevice) return;

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check target for custom cursor label
      const target = e.target.closest("[data-cursor], button, a, input, textarea, select");
      if (target) {
        setIsHovered(true);
        const customLabel = target.getAttribute("data-cursor");
        if (customLabel) {
          setCursorText(customLabel);
        } else if (target.tagName === "A" || target.tagName === "BUTTON") {
          setCursorText("ACCESS");
        } else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          setCursorText("INPUT");
        } else {
          setCursorText("");
        }
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Outer reticle / ring */}
      <motion.div
        animate={{
          x: mousePosition.x - (isHovered ? 24 : 12),
          y: mousePosition.y - (isHovered ? 24 : 12),
          width: isHovered ? 48 : 24,
          height: isHovered ? 48 : 24,
          borderColor: isHovered ? "#ff003c" : "rgba(255, 255, 255, 0.4)",
          backgroundColor: isHovered ? "rgba(255, 0, 60, 0.1)" : "transparent",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.5 }}
        style={{
          position: "fixed",
          border: "1.5px solid",
          borderRadius: "50%",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {cursorText && (
          <span
            style={{
              position: "absolute",
              top: "100%",
              marginTop: "6px",
              fontSize: "0.62rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#ff2a55",
              background: "#080808",
              padding: "2px 6px",
              border: "1px solid #ff003c",
              borderRadius: "2px",
              whiteSpace: "nowrap"
            }}
          >
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Inner precise dot */}
      <motion.div
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 600, mass: 0.1 }}
        style={{
          position: "fixed",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: isHovered ? "#ff003c" : "#ffffff",
          pointerEvents: "none",
          boxShadow: isHovered ? "0 0 8px #ff003c" : "none"
        }}
      />
    </div>
  );
}
