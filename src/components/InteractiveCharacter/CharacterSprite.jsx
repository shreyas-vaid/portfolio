import { useEffect } from "react";
import { SPRITE_ASSETS, ALL_SPRITE_URLS } from "./characterConfig";

export default function CharacterSprite({ viewState = "FRONT", isWalking = false }) {
  // Preload all angle sprites on mount
  useEffect(() => {
    ALL_SPRITE_URLS.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const activeSrc = SPRITE_ASSETS[viewState] || SPRITE_ASSETS.FRONT;

  return (
    <div
      className={`chibi-sprite-wrap ${isWalking ? "chibi-sprite-walking" : "chibi-sprite-idle"}`}
    >
      {/* Active Turnaround Frame */}
      <img
        src={activeSrc}
        alt={`Chibi Shreyas (${viewState})`}
        className="chibi-frame"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      {/* Ground Shadow underneath feet */}
      <div className="chibi-ground-shadow" />
    </div>
  );
}
