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
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const unsub = gameState.subscribe((newState) => {
      setSt(newState);
    });
    return unsub;
  }, []);

  const currentTier = gameState.getCurrentLevel();
  const nextXP = currentTier.maxXP;
  const currentXP = st.xp;
  const progressPct = Math.min(100, Math.max(0, ((currentXP - currentTier.minXP) / (nextXP - currentTier.minXP)) * 100));

  const totalDiscoveries = Object.keys(st.completedActions).length;

  const handleToggleTheme = () => {
    if (st.isVioletUnlocked) {
      gameState.setTheme(st.activeTheme === "violet" ? "red" : "violet");
    }
  };

  return (
    <div className={`game-hud-root ${isCollapsed ? "collapsed" : ""}`} aria-label="Exploration HUD">
      {/* Collapse / Expand Toggle Button */}
      <button
        type="button"
        className="hud-collapse-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand System HUD" : "Minimize System HUD"}
      >
        <span className="hud-pulse-dot" />
        <span className="hud-toggle-label">
          {isCollapsed ? `LVL 0${currentTier.level}` : "HUD //"}
        </span>
      </button>

      {/* Expanded HUD Content */}
      {!isCollapsed && (
        <div className="hud-panel-content">
          {/* Top Row: Level & XP Bar */}
          <div className="hud-status-row">
            <div className="hud-rank-block">
              <span className="hud-lvl-tag">LVL 0{currentTier.level}</span>
              <span className="hud-rank-title">{currentTier.title}</span>
            </div>
            <div className="hud-discoveries-tag">
              {totalDiscoveries} DISCOVERIES
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="hud-xp-track" title={`${currentXP} / ${nextXP} XP`}>
            <div className="hud-xp-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="hud-xp-numbers">
            <span>EXP: {currentXP} XP</span>
            <span>NEXT: {nextXP} XP</span>
          </div>

          {/* Action Buttons */}
          <div className="hud-actions-row">
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
              title="Open Achievements Archive"
            >
              🏆 AWARDS
            </button>

            {/* Secret Theme Switcher if unlocked */}
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
      )}
    </div>
  );
}
