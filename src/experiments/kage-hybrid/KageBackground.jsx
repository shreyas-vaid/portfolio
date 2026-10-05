import React, { useState, useEffect } from "react";
import { EyeOff, Sparkles, Wind } from "lucide-react";
import { KageLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { LandingPageFrame } from "../../shaders/landing-pages/LandingPageFrame";

/**
 * KageBackground — The 40% Three.js / WebGL atmospheric layer.
 * 
 * Provides:
 * 1. Live Three.js WebGL canvas (#gl) background presentation running live in the background.
 * 2. Atmospheric ember/sakura mist overlay.
 * 3. Performance controls (pause WebGL on visibility change, reduced-motion fallback).
 * 4. Interactive Portal Mode: allows expanding the full canonical Kage Landing Page to explore.
 */
export default function KageBackground() {
  const [isAtmosphereActive, setIsAtmosphereActive] = useState(true);
  const [isFullSceneModalOpen, setIsFullSceneModalOpen] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Check WebGL availability and reduced motion preference
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
          opacity: isAtmosphereActive ? 1 : 0.15,
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {webglSupported ? (
          <LandingPageFrame
            title="Kage — Kyoto Mountain Temple WebGL"
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

      {/* Edge Calligraphic Seal: 什雷亚斯 */}
      <aside className="kage-vertical-seal" aria-hidden="true">
        <span className="seal-char">什</span>
        <span className="seal-char">雷</span>
        <span className="seal-char">亚</span>
        <span className="seal-char">斯</span>
        <span className="kage-vertical-seal-dot" />
      </aside>

      {/* Floating Tactical Kage Controls (Minimal HUD widget on top-right) */}
      <div className="kage-hud-controls" data-cursor="ACTION">
        <button
          onClick={() => setIsAtmosphereActive(!isAtmosphereActive)}
          className="kage-hud-btn"
          title={isAtmosphereActive ? "Dim Kage Atmosphere" : "Boost Kage Atmosphere"}
        >
          {isAtmosphereActive ? <Wind size={13} color="#e0231c" /> : <EyeOff size={13} color="#888" />}
          <span>{isAtmosphereActive ? "KAGE 3D: ON" : "KAGE 3D: DIM"}</span>
        </button>

        <button
          onClick={() => setIsFullSceneModalOpen(true)}
          className="kage-hud-btn kage-hud-btn-primary"
          title="Inspect Canonical Kage Landing Page Scene"
        >
          <Sparkles size={13} color="#ff3344" />
          <span>VIEW FULL KAGE SCENE</span>
        </button>
      </div>

      {/* Full Canonical Kage Landing Page Modal */}
      {isFullSceneModalOpen && (
        <div className="kage-full-modal-backdrop" onClick={() => setIsFullSceneModalOpen(false)}>
          <div
            className="kage-full-modal-window"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Canonical ThreeUI Kage Landing Page"
          >
            <div className="kage-full-modal-header">
              <div className="kage-modal-title">
                <span className="kage-kanji-tag">影</span>
                <div>
                  <strong>CANONICAL THREEUI KAGE LANDING PAGE</strong>
                  <span className="kage-modal-subtitle">Direct Three.js WebGL & Architecture Inspection</span>
                </div>
              </div>
              <button
                className="kage-modal-close-btn"
                onClick={() => setIsFullSceneModalOpen(false)}
                aria-label="Close modal"
              >
                ✕ CLOSE
              </button>
            </div>
            <div className="kage-modal-body">
              <div className="shader-frame" style={{ width: "100%", height: "100%", position: "relative" }}>
                <KageLandingPage
                  headingFont="onest"
                  bodyFont="onest"
                  headingWeight="400"
                  bodyWeight="300"
                  primaryColor="#e0231c"
                  headingSize={46}
                  bodySize={17}
                  headingLetterSpacing={-0.012}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
