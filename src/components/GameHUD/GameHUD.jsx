import { useState, useEffect } from "react";
import { gameState } from "../../utils/gameState";
import "./hud.css";

export default function GameHUD({
  onOpenInventory,
  onOpenRadio,
  onOpenTerminal,
  onOpenAchievements
}) {
  const [st, setSt] = useState(gameState.state);

  useEffect(() => {
    const unsub = gameState.subscribe((newState) => {
      setSt(newState);
    });
    return unsub;
  }, []);

  const handleToggleTheme = () => {
    if (st.isVioletUnlocked) {
      gameState.setTheme(st.activeTheme === "violet" ? "red" : "violet");
    }
  };

  return (
    <div className="game-hud-root hide-mobile" aria-label="Tactical Quick Tools">
      <div className="hud-panel-content">
        <div className="hud-actions-row">
          <span className="hud-label-prefix">TOOLS //</span>
          <button
            type="button"
            className="hud-btn"
            onClick={onOpenInventory}
            title="Open Tactical Inventory"
          >
            🎒 INVENTORY
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={onOpenRadio}
            title="Open SV Radio"
          >
            📻 RADIO
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={onOpenTerminal}
            title="Open SV-OS Terminal"
          >
            ⌨️ TERMINAL
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={onOpenAchievements}
            title="Open Milestones & Awards"
          >
            🏆 MILESTONES
          </button>

          {st.isVioletUnlocked && (
            <button
              type="button"
              className="hud-btn theme-btn"
              onClick={handleToggleTheme}
              title="Switch Visual Protocol"
            >
              {st.activeTheme === "violet" ? "💜 VIOLET" : "🔴 RED"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

