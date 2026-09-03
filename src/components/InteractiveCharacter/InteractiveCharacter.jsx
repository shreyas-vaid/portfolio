import { useState, useEffect, useRef, useCallback } from "react";
import CharacterSprite from "./CharacterSprite";
import CharacterDialogue from "./CharacterDialogue";
import CharacterHUD from "./CharacterHUD";
import {
  calculateViewingState,
  SECTION_DIALOGUES,
  HOVER_DIALOGUES
} from "./characterConfig";
import "./character.css";

export default function InteractiveCharacter({ activeSection = "hero" }) {
  const [viewState, setViewState] = useState("FRONT");
  const [dialogue, setDialogue] = useState(SECTION_DIALOGUES.hero || "SYSTEM ONLINE.");
  const containerRef = useRef(null);

  // Smooth angle tracking references
  const targetCoords = useRef({ x: 0, y: 0 });
  const currentCoords = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  const idleTimer = useRef(null);
  const lastSectionRef = useRef(activeSection);

  // Check touch / mobile device
  const isTouchDevice = useRef(
    typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches)
  );

  // Update dialogue when activeSection changes
  useEffect(() => {
    if (activeSection && activeSection !== lastSectionRef.current) {
      lastSectionRef.current = activeSection;
      const text = SECTION_DIALOGUES[activeSection];
      if (text) {
        setDialogue(text);
      }
    }
  }, [activeSection]);

  // Smooth lerp loop
  const updateOrientation = useCallback(() => {
    if (!containerRef.current) return;

    // Linear interpolation (lerp) towards target cursor position
    const lerpFactor = 0.12;
    currentCoords.current.x +=
      (targetCoords.current.x - currentCoords.current.x) * lerpFactor;
    currentCoords.current.y +=
      (targetCoords.current.y - currentCoords.current.y) * lerpFactor;

    // Get character screen center
    const rect = containerRef.current.getBoundingClientRect();
    const charCenterX = rect.left + rect.width / 2;
    const charCenterY = rect.top + rect.height * 0.4; // eye / head level

    const deltaX = currentCoords.current.x - charCenterX;
    const deltaY = currentCoords.current.y - charCenterY;

    const newState = calculateViewingState(deltaX, deltaY);
    setViewState((prev) => (prev !== newState ? newState : prev));

    animationFrameId.current = requestAnimationFrame(updateOrientation);
  }, []);

  useEffect(() => {
    // On mobile / touch screens, maintain neutral FRONT stance and skip pointer tracking
    if (isTouchDevice.current) {
      setViewState("FRONT");
      return;
    }

    // Set initial target coords to screen center
    targetCoords.current = {
      x: window.innerWidth * 0.4,
      y: window.innerHeight * 0.4
    };
    currentCoords.current = { ...targetCoords.current };

    animationFrameId.current = requestAnimationFrame(updateOrientation);

    const onMouseMove = (e) => {
      targetCoords.current = { x: e.clientX, y: e.clientY };

      // Reset idle timer: if no cursor movement for 5 seconds, face front
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          // Aim directly ahead of character
          targetCoords.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + 300
          };
        }
      }, 5000);

      // Check if cursor is hovering interactive elements for contextual micro-dialogue
      const hovered = e.target.closest(
        "[data-cursor='RESUME'], [data-cursor='EXPLORE'], [data-cursor='QUEST'], button, a"
      );
      if (hovered) {
        const cursorAttr = hovered.getAttribute("data-cursor");
        if (cursorAttr === "RESUME") {
          setDialogue(HOVER_DIALOGUES.resume);
        } else if (cursorAttr === "EXPLORE") {
          setDialogue(HOVER_DIALOGUES.nav);
        }
      }
    };

    const onMouseLeave = () => {
      // Smoothly return to front when cursor leaves viewport
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        targetCoords.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + 300
        };
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
    };
  }, [updateOrientation]);

  return (
    <div
      ref={containerRef}
      className="chibi-companion-root"
      aria-label="Interactive Companion Shreyas"
    >
      {/* Speech Bubble / Dialogue Micro-messages */}
      <CharacterDialogue message={dialogue} duration={3800} />

      {/* Turnaround Character Sprite */}
      <CharacterSprite viewState={viewState} />

      {/* Tactical Telemetry HUD */}
      <CharacterHUD viewState={viewState} />
    </div>
  );
}
