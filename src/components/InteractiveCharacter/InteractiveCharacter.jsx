import { useState, useEffect, useRef } from "react";
import CharacterSprite from "./CharacterSprite";
import CharacterDialogue from "./CharacterDialogue";
import CharacterChat from "./CharacterChat/CharacterChat";
import {
  calculateCursorGazeDirection,
  SECTION_DIALOGUES
} from "./characterConfig";
import { gameState } from "../../utils/gameState";
import "./character.css";

export default function InteractiveCharacter({ activeSection = "hero" }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [viewState, setViewState] = useState("FRONT");
  const [characterPose, setCharacterPose] = useState("FRONT");
  const [dialogue, setDialogue] = useState(() => {
    if (gameState.state.visitCount > 1) {
      const returnQuotes = [
        "OH. YOU'RE BACK. WELCOME.",
        "YOU STILL HAVEN'T FOUND EVERYTHING.",
        "WELCOME BACK, EXPLORER."
      ];
      return returnQuotes[Math.floor(Math.random() * returnQuotes.length)];
    }
    return "SV-01 ONLINE. CLICK TO TALK!";
  });
  const [showCallout, setShowCallout] = useState(true);

  const anchorRef = useRef(null);
  const isTouchDevice = useRef(
    typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth <= 768)
  );

  // Narrator reaction to game events (items, achievements, secrets)
  useEffect(() => {
    const unsub = gameState.subscribeToasts((toast) => {
      if (toast.message.includes("VIOLET")) {
        setDialogue("...YOU WEREN'T SUPPOSED TO FIND THAT.");
      } else if (toast.message.includes("UNLOCKED")) {
        setDialogue("ACHIEVEMENT UNLOCKED!");
      } else if (toast.message.includes("ITEM")) {
        setDialogue("YOU FOUND SOMETHING.");
      }
    });
    return unsub;
  }, []);

  // Long dwell hint: if visitor stays on a section for > 42s
  useEffect(() => {
    const dwellTimer = setTimeout(() => {
      if (!isChatOpen) {
        const hints = [
          "STILL EXPLORING? CHECK THE INVENTORY.",
          "THERE ARE A FEW SECRETS AROUND HERE.",
          "CURIOUS? TRY THE DEVELOPER TERMINAL."
        ];
        setDialogue(hints[Math.floor(Math.random() * hints.length)]);
      }
    }, 42000);
    return () => clearTimeout(dwellTimer);
  }, [activeSection, isChatOpen]);

  // Update speech bubble when visitor scrolls to new sections (only when chat is closed)
  useEffect(() => {
    if (!isChatOpen && activeSection) {
      const text = SECTION_DIALOGUES[activeSection];
      if (text) {
        setDialogue(text);
      }
    }
  }, [activeSection, isChatOpen]);

  // Subtle cursor gaze tracking when chat is CLOSED on desktop
  useEffect(() => {
    if (isChatOpen || isTouchDevice.current) {
      setViewState("FRONT");
      return;
    }

    const onMouseMove = (e) => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - charCenterX;
      const deltaY = e.clientY - charCenterY;

      // Subtle directional gaze
      const gaze = calculateCursorGazeDirection(deltaX, deltaY);
      setViewState(gaze);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isChatOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isChatOpen) {
        setIsChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  const handleToggleChat = () => {
    const nextState = !isChatOpen;
    setIsChatOpen(nextState);
    if (nextState) {
      setViewState("FRONT");
      setCharacterPose("FRONT");
      setShowCallout(false);
    } else {
      setShowCallout(true);
    }
  };

  const handleSetCharacterPose = (pose) => {
    setCharacterPose(pose);
    setViewState(pose || "FRONT");
  };

  return (
    <div className="chibi-companion-root" ref={anchorRef} aria-label="Interactive AI Companion">
      {/* Cyberpunk x JRPG Chat Terminal Window */}
      <CharacterChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSetCharacterPose={handleSetCharacterPose}
      />

      {/* Clickable Character Actor & Tactical Button */}
      <button
        type="button"
        className="chibi-actor-btn"
        onClick={handleToggleChat}
        aria-label={isChatOpen ? "Close SV-01 Chat" : "Open SV-01 Companion Chat"}
        title="Chat with SV-01 (Shreyas's AI Sidekick)"
      >
        {/* Ambient Greeting Bubble when chat is closed */}
        {!isChatOpen && dialogue && (
          <CharacterDialogue message={dialogue} duration={4000} />
        )}

        {/* Miniature Ghibli Character Frame */}
        <CharacterSprite
          viewState={isChatOpen ? "FRONT" : viewState}
          isWalking={false}
        />

        {/* Tactical Status Prompt Callout */}
        {!isChatOpen && showCallout && (
          <div className="chibi-callout-badge">
            <span className="chibi-callout-led" />
            <span>SV-01 // TALK</span>
          </div>
        )}
      </button>
    </div>
  );
}
