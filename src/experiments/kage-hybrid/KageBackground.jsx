import React, { useState, useEffect } from "react";
import { LandingPageFrame } from "../../shaders/landing-pages/LandingPageFrame";

/**
 * KageBackground — The atmospheric 3D Three.js WebGL & mist layer.
 * 
 * Provides:
 * 1. Live Three.js WebGL Kyoto Mountain Temple canvas (#gl) running as ambient background.
 * 2. Atmospheric ember/sakura mist overlay & cinematic vignette.
 * 3. Cinematic environmental identity: 什雷亚斯 backdrop & edge calligraphic seal.
 */
export default function KageBackground() {
  const [webglSupported, setWebglSupported] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
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
        }}
      >
        {webglSupported ? (
          <LandingPageFrame
            title="Kyoto Mountain Temple WebGL"
            sourceUrl="/landing-pages/kage.html"
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
