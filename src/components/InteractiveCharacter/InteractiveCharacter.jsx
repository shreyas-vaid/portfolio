import { useState, useEffect, useRef } from "react";
import CharacterSprite from "./CharacterSprite";
import CharacterDialogue from "./CharacterDialogue";
import {
  calculateWalkDirection,
  calculateCursorGazeDirection,
  SECTION_DIALOGUES,
  HOVER_DIALOGUES
} from "./characterConfig";
import "./character.css";

export default function InteractiveCharacter({ activeSection = "hero" }) {
  // Positional state in viewport pixels
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [viewState, setViewState] = useState("FRONT");
  const [isWalking, setIsWalking] = useState(false);
  const [dialogue, setDialogue] = useState(SECTION_DIALOGUES.hero || "SYSTEM ONLINE.");

  // Animation & tracking refs
  const posRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const isWalkingRef = useRef(false);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const lastSectionRef = useRef(activeSection);
  const lastMouseMoveTime = useRef(performance.now());
  const idleStrollTimer = useRef(null);
  const initializedRef = useRef(false);

  // Check touch / mobile screen
  const isTouchDevice = useRef(
    typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth <= 768)
  );

  // Helper to calculate a safe follow destination near the cursor (small Pokémon companion offset)
  const computeFollowTarget = (cursorX, cursorY) => {
    if (typeof window === "undefined") return { x: 300, y: 300 };

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // Small companion offset: follow to the side, slightly behind the cursor
    const offsetX = cursorX < winW * 0.5 ? 55 : -105;
    const offsetY = cursorY < winH * 0.5 ? 25 : -65;

    let targetX = cursorX + offsetX;
    let targetY = cursorY + offsetY;

    // Safe clamp across the ENTIRE viewport (full page roaming)
    const minX = 15;
    const maxX = winW - 75;
    const minY = 35;
    const maxY = winH - 105;

    targetX = Math.max(minX, Math.min(maxX, targetX));
    targetY = Math.max(minY, Math.min(maxY, targetY));

    return { x: targetX, y: targetY };
  };

  // Initialize position on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // Start in lower right side
    const startX = Math.max(40, winW * 0.82);
    const startY = Math.max(80, winH * 0.72);

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
    }
  }, [activeSection]);

  // Main Movement & Cursor Tracking Loop
  useEffect(() => {
    if (isTouchDevice.current) {
      setViewState("FRONT");
      return;
    }

    // 60FPS animation loop
    const loop = (now) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Character center points for 60x84px sprite
      const charCenterX = posRef.current.x + 30;
      const charCenterY = posRef.current.y + 45;

      const dx = targetPosRef.current.x - posRef.current.x;
      const dy = targetPosRef.current.y - posRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Distance threshold: if target is more than 20px away, WALK!
      if (dist > 20) {
        if (!isWalkingRef.current) {
          isWalkingRef.current = true;
          setIsWalking(true);
        }

        // Dynamic, responsive companion walking speed
        const speed = Math.max(85, Math.min(220, dist * 1.3));
        const step = speed * dt;

        if (dist <= step || dist < 3) {
          // Arrived near viewer
          posRef.current.x = targetPosRef.current.x;
          posRef.current.y = targetPosRef.current.y;
          setPos({ ...posRef.current });
          isWalkingRef.current = false;
          setIsWalking(false);

          // Face the cursor immediately upon stopping
          const gazeDx = cursorRef.current.x - charCenterX;
          const gazeDy = cursorRef.current.y - (posRef.current.y + 35);
          setViewState(calculateCursorGazeDirection(gazeDx, gazeDy));
        } else {
          // Move towards target
          posRef.current.x += (dx / dist) * step;
          posRef.current.y += (dy / dist) * step;
          setPos({ x: posRef.current.x, y: posRef.current.y });

          // Turn to face walking direction
          setViewState(calculateWalkDirection(dx, dy));
        }
      } else {
        // Character stopped near viewer -> gaze tracks cursor!
        if (isWalkingRef.current) {
          isWalkingRef.current = false;
          setIsWalking(false);
        }

        const gazeDx = cursorRef.current.x - charCenterX;
        const gazeDy = cursorRef.current.y - (posRef.current.y + 35);
        const newGaze = calculateCursorGazeDirection(gazeDx, gazeDy);
        setViewState((prev) => (prev !== newGaze ? newGaze : prev));
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Mouse movement listener: moves character along with the viewer across the ENTIRE screen!
    const onMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTime.current = performance.now();

      // Compute new companion waypoint near the viewer's cursor
      const newFollowTarget = computeFollowTarget(e.clientX, e.clientY);
      targetPosRef.current = newFollowTarget;

      // Check contextual hover reactions
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

    // If mouse doesn't move for 4s, take a subtle micro-stroll nearby
    const checkIdleStroll = () => {
      const now = performance.now();
      if (now - lastMouseMoveTime.current > 4000 && !isWalkingRef.current) {
        const jitterX = (Math.random() - 0.5) * 50;
        const jitterY = (Math.random() - 0.5) * 40;
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        targetPosRef.current = {
          x: Math.max(20, Math.min(winW - 75, posRef.current.x + jitterX)),
          y: Math.max(40, Math.min(winH - 105, posRef.current.y + jitterY))
        };
      }
    };

    idleStrollTimer.current = setInterval(checkIdleStroll, 3500);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (idleStrollTimer.current) clearInterval(idleStrollTimer.current);
    };
  }, []);

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
        <CharacterDialogue message={dialogue} duration={3200} />

        {/* Small Ghibli x Pokémon Style Character Sprite with Walk Bob & Shadow */}
        <CharacterSprite viewState={viewState} isWalking={isWalking} />
      </div>
    </div>
  );
}
