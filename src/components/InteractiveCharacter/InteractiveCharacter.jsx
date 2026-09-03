import { useState, useEffect, useRef, useCallback } from "react";
import CharacterSprite from "./CharacterSprite";
import CharacterDialogue from "./CharacterDialogue";
import CharacterHUD from "./CharacterHUD";
import {
  calculateWalkDirection,
  calculateCursorGazeDirection,
  SECTION_DIALOGUES,
  HOVER_DIALOGUES,
  SECTION_ROAM_ZONES
} from "./characterConfig";
import "./character.css";

export default function InteractiveCharacter({ activeSection = "hero" }) {
  // Positional state in viewport pixels
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [viewState, setViewState] = useState("FRONT");
  const [isWalking, setIsWalking] = useState(false);
  const [dialogue, setDialogue] = useState(SECTION_DIALOGUES.hero || "SYSTEM ONLINE.");

  // Refs for animation loop & AI state
  const posRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const aiStateRef = useRef("IDLE"); // "IDLE" | "WALKING"
  const waitTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const lastSectionRef = useRef(activeSection);
  const initializedRef = useRef(false);

  // Check touch / mobile device
  const isTouchDevice = useRef(
    typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth <= 768)
  );

  // Helper to pick a safe roaming point in viewport
  const pickDestination = useCallback((sectionKey) => {
    if (typeof window === "undefined") return { x: 300, y: 300 };

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const safeMarginX = Math.min(100, winW * 0.1);
    const safeMarginY = Math.min(140, winH * 0.15);

    const zones = SECTION_ROAM_ZONES[sectionKey] || SECTION_ROAM_ZONES.hero;
    const chosenZone = zones[Math.floor(Math.random() * zones.length)];

    // Add gentle random jitter around the zone point (+/- 60px)
    const jitterX = (Math.random() - 0.5) * 120;
    const jitterY = (Math.random() - 0.5) * 80;

    let targetX = chosenZone.x * winW + jitterX;
    let targetY = chosenZone.y * winH + jitterY;

    // Clamp inside safe viewport bounds
    targetX = Math.max(safeMarginX, Math.min(winW - safeMarginX - 120, targetX));
    targetY = Math.max(safeMarginY, Math.min(winH - safeMarginY - 140, targetY));

    return { x: targetX, y: targetY };
  }, []);

  // Initialize position on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const startX = winW * 0.82;
    const startY = winH * 0.70;

    posRef.current = { x: startX, y: startY };
    targetPosRef.current = { x: startX, y: startY };
    cursorRef.current = { x: winW * 0.5, y: winH * 0.4 };
    setPos({ x: startX, y: startY });
    initializedRef.current = true;
  }, []);

  // React to section changes (user scrolling through website)
  useEffect(() => {
    if (activeSection && activeSection !== lastSectionRef.current) {
      lastSectionRef.current = activeSection;

      // Update contextual speech
      const text = SECTION_DIALOGUES[activeSection];
      if (text) {
        setDialogue(text);
      }

      // If desktop, guide character to explore near the new section
      if (!isTouchDevice.current && initializedRef.current) {
        const nextTarget = pickDestination(activeSection);
        targetPosRef.current = nextTarget;
        aiStateRef.current = "WALKING";
        setIsWalking(true);

        const dx = nextTarget.x - posRef.current.x;
        const dy = nextTarget.y - posRef.current.y;
        setViewState(calculateWalkDirection(dx, dy));
      }
    }
  }, [activeSection, pickDestination]);

  // Main Movement & Autonomous Behavior Loop
  useEffect(() => {
    if (isTouchDevice.current) {
      setViewState("FRONT");
      return;
    }

    // Schedule next autonomous stroll
    const scheduleNextRoam = () => {
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);

      // Random wait between 3.5 and 7 seconds
      const delay = 3500 + Math.random() * 3500;
      waitTimerRef.current = setTimeout(() => {
        if (aiStateRef.current === "IDLE") {
          const nextTarget = pickDestination(lastSectionRef.current);
          const dist = Math.hypot(
            nextTarget.x - posRef.current.x,
            nextTarget.y - posRef.current.y
          );

          // Only walk if distance is meaningful (> 60px)
          if (dist > 60) {
            targetPosRef.current = nextTarget;
            aiStateRef.current = "WALKING";
            setIsWalking(true);

            const dx = nextTarget.x - posRef.current.x;
            const dy = nextTarget.y - posRef.current.y;
            setViewState(calculateWalkDirection(dx, dy));
          } else {
            // Pick again slightly later
            scheduleNextRoam();
          }
        }
      }, delay);
    };

    scheduleNextRoam();

    // 60FPS animation loop for smooth movement and gaze updates
    const loop = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (aiStateRef.current === "WALKING") {
        const dx = targetPosRef.current.x - posRef.current.x;
        const dy = targetPosRef.current.y - posRef.current.y;
        const dist = Math.hypot(dx, dy);

        // Gentle walking speed (approx 75 px/second)
        const speed = 75;
        const step = speed * dt;

        if (dist <= step || dist < 4) {
          // Arrived at destination!
          posRef.current.x = targetPosRef.current.x;
          posRef.current.y = targetPosRef.current.y;
          setPos({ ...posRef.current });
          aiStateRef.current = "IDLE";
          setIsWalking(false);

          // Resume cursor tracking from current stop position
          const gazeDx = cursorRef.current.x - (posRef.current.x + 65);
          const gazeDy = cursorRef.current.y - (posRef.current.y + 80);
          setViewState(calculateCursorGazeDirection(gazeDx, gazeDy));

          scheduleNextRoam();
        } else {
          // Move towards destination
          posRef.current.x += (dx / dist) * step;
          posRef.current.y += (dy / dist) * step;
          setPos({ x: posRef.current.x, y: posRef.current.y });

          // Keep facing walk direction
          setViewState(calculateWalkDirection(dx, dy));
        }
      } else if (aiStateRef.current === "IDLE") {
        // Look towards cursor position
        const charHeadX = posRef.current.x + 65;
        const charHeadY = posRef.current.y + 80;
        const gazeDx = cursorRef.current.x - charHeadX;
        const gazeDy = cursorRef.current.y - charHeadY;

        const newGaze = calculateCursorGazeDirection(gazeDx, gazeDy);
        setViewState((prev) => (prev !== newGaze ? newGaze : prev));
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Mouse movement listener (updates cursor position & hover interactions)
    const onMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };

      // Check for contextual hover cues
      const target = e.target.closest("[data-cursor], button, a");
      if (target) {
        const cursorType = target.getAttribute("data-cursor");
        if (cursorType === "RESUME") {
          setDialogue(HOVER_DIALOGUES.resume);
        } else if (cursorType === "QUEST") {
          setDialogue(HOVER_DIALOGUES.quest);
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    };
  }, [pickDestination]);

  return (
    <div className="chibi-roam-layer" aria-label="Roaming Companion Layer">
      {/* Moving Actor positioned via translate3d for max 60FPS GPU performance */}
      <div
        className="chibi-actor"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
        }}
      >
        {/* Contextual Speech Bubble */}
        <CharacterDialogue message={dialogue} duration={3600} />

        {/* 8-Directional Character Sprite with Walk Bob & Shadow */}
        <CharacterSprite viewState={viewState} isWalking={isWalking} />

        {/* Tactical Status HUD */}
        <CharacterHUD viewState={viewState} isWalking={isWalking} />
      </div>
    </div>
  );
}
