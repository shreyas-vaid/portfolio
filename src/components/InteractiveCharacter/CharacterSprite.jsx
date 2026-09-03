import { useEffect, useState } from "react";
import { SPRITE_ASSETS, ALL_SPRITE_URLS } from "./characterConfig";

export default function CharacterSprite({ viewState = "FRONT", isWalking = false }) {
  const [preloaded, setPreloaded] = useState(false);

  // Preload all angle sprites on mount
  useEffect(() => {
    let loadedCount = 0;
    ALL_SPRITE_URLS.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === ALL_SPRITE_URLS.length) {
          setPreloaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === ALL_SPRITE_URLS.length) {
          setPreloaded(true);
        }
      };
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
