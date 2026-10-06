import React, { useState, useEffect, useMemo, memo } from "react";
import { LandingPageFrame } from "../../shaders/landing-pages/LandingPageFrame";

/**
 * KageBackground — The atmospheric 3D Three.js WebGL & mist layer.
 * 
 * Performance Optimizations:
 * 1. Device-adaptive DPR (capped at 1.35 on desktop, 1.0 on mobile) to eliminate fill-rate choking.
 * 2. Pauses WebGL rendering loop when document is hidden / tab inactive.
 * 3. GPU-isolated compositing layer via translateZ(0) and will-change.
 * 4. Memoized to avoid React re-renders when parent scroll state updates.
 */
function KageBackground() {
  const [webglSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });

  // Compute responsive, GPU-friendly source URL with capped DPR and quality flag
  const sourceUrl = useMemo(() => {
    if (typeof window === "undefined") return "/landing-pages/kage.html";
    const isMobile = window.innerWidth <= 768 || (navigator.maxTouchPoints > 0 && window.innerWidth <= 1024);
    const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.35);
    const q = isMobile ? "low" : "high";
    return `/landing-pages/kage.html?dpr=${dpr}&q=${q}&adapt=1`;
  }, []);

  // Forward tab visibility changes to pause Three.js rAF loop
  useEffect(() => {
    const handleVisibility = () => {
      const iframe = document.querySelector(".kage-backdrop-wrapper iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(document.hidden ? "pause" : "resume", "*");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <>
      {/* 3D WebGL Background Scene */}
      <div
        className="kage-backdrop-wrapper"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          opacity: 1,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        {webglSupported ? (
          <LandingPageFrame
            title="Kyoto Mountain Temple WebGL"
            sourceUrl={sourceUrl}
            backgroundCanvasSelector="#gl"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              background: "#070709",
            }}
          />
        ) : (
          <div className="kage-fallback-sky" />
        )}

        {/* Ambient Mist & Vermilion Horizon Gradient */}
        <div className="kage-atmosphere-overlay" />
        <div className="kage-mist-layer" />
        <div className="kage-vignette-layer" />
      </div>

      {/* Large Cinematic Environmental Name Identity: 什雷亚斯 */}
      <div className="kage-cinematic-name-backdrop" aria-hidden="true">
        <span className="kage-cinematic-name-text">什雷亚斯</span>
      </div>

      {/* Edge Calligraphic Seal: 什雷亚斯 */}
      <aside className="kage-vertical-seal" aria-hidden="true">
        <span className="seal-char">什</span>
        <span className="seal-char">雷</span>
        <span className="seal-char">亚</span>
        <span className="seal-char">斯</span>
        <span className="kage-vertical-seal-dot" />
      </aside>
    </>
  );
}

export default memo(KageBackground);
