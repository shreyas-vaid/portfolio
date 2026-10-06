import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState({ isHovered: false, text: "" });
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const isHoveredRef = useRef(false);
  const rafRef = useRef(null);

  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 768px)").matches ||
      window.innerWidth <= 768
    );
  });

  useEffect(() => {
    if (isTouchDevice) return;

    // Smooth ring interpolation loop (runs strictly on RAF, zero React renders)
    const animate = () => {
      const pos = posRef.current;
      pos.x += (pos.targetX - pos.x) * 0.22;
      pos.y += (pos.targetY - pos.y) * 0.22;

      const hovered = isHoveredRef.current;
      const offset = hovered ? 24 : 12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x - offset}px, ${pos.y - offset}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    let lastCheckTime = 0;
    const onMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      posRef.current.targetX = x;
      posRef.current.targetY = y;

      // Direct instant dot positioning without React state
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      }

      // Throttle DOM target inspection to ~30ms to avoid DOM queries on every subpixel
      const now = performance.now();
      if (now - lastCheckTime > 32) {
        lastCheckTime = now;
        const target = e.target.closest("[data-cursor], button, a, input, textarea, select");
        if (target) {
          isHoveredRef.current = true;
          let text = "";
          const customLabel = target.getAttribute("data-cursor");
          if (customLabel) {
            text = customLabel;
          } else if (target.tagName === "A" || target.tagName === "BUTTON") {
            text = "ACCESS";
          } else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
            text = "INPUT";
          }
          setCursorState((prev) => {
            if (prev.isHovered && prev.text === text) return prev;
            return { isHovered: true, text };
          });
        } else {
          isHoveredRef.current = false;
          setCursorState((prev) => {
            if (!prev.isHovered && prev.text === "") return prev;
            return { isHovered: false, text: "" };
          });
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  const { isHovered, text } = cursorState;
  const ringSize = isHovered ? 48 : 24;

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Outer reticle / ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          border: `1.5px solid ${isHovered ? "#ff003c" : "rgba(255, 255, 255, 0.4)"}`,
          backgroundColor: isHovered ? "rgba(255, 0, 60, 0.1)" : "transparent",
          borderRadius: "50%",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform",
          transition: "width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background-color 0.2s ease",
        }}
      >
        {text && (
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
            {text}
          </span>
        )}
      </div>

      {/* Inner precise dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: isHovered ? "#ff003c" : "#ffffff",
          transform: isHovered ? "scale(1.5)" : "scale(1)",
          boxShadow: isHovered ? "0 0 8px #ff003c" : "none",
          pointerEvents: "none",
          willChange: "transform",
          transition: "background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease"
        }}
      />
    </div>
  );
}
