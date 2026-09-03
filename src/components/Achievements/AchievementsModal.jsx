import { useState, useEffect } from "react";
import { achievementsList, achievementCategories } from "../../data/achievementData";
import { gameState } from "../../utils/gameState";
import "./achievements.css";

export default function AchievementsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [unlockedList, setUnlockedList] = useState(gameState.state.unlockedAchievements);

  useEffect(() => {
    const unsub = gameState.subscribe((st) => {
      setUnlockedList(st.unlockedAchievements);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const filtered = achievementsList.filter(
    (ach) => activeTab === "ALL" || ach.type === activeTab
  );

  const totalUnlocked = achievementsList.filter((a) =>
    a.type === "CAREER" ? a.unlocked : unlockedList.includes(a.id)
  ).length;

  return (
    <div className="ach-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ach-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ach-modal-header">
          <div className="ach-title-wrap">
            <span className="ach-badge">ARCHIVE // XP</span>
            <h3 className="ach-title">TACTICAL ACHIEVEMENTS & MILESTONES</h3>
          </div>
          <button type="button" className="ach-close-btn" onClick={onClose}>
            ✕ CLOSE
          </button>
        </div>

        {/* Progress Bar & Filter Tabs */}
        <div className="ach-controls-bar">
          <div className="ach-tabs-group">
            {achievementCategories.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`ach-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="ach-stat-count">
            CLEARED: <span style={{ color: "var(--accent-red-bright)" }}>{totalUnlocked}</span> / {achievementsList.length}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="ach-modal-body">
          <div className="ach-cards-grid">
            {filtered.map((ach) => {
              const isUnlocked = ach.type === "CAREER" ? ach.unlocked : unlockedList.includes(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`ach-item-card ${isUnlocked ? "unlocked" : "locked"}`}
                >
                  <div className="ach-card-icon">{isUnlocked ? ach.icon : "🔒"}</div>
                  <div className="ach-card-content">
                    <div className="ach-card-top-row">
                      <span className="ach-type-badge">{ach.type}</span>
                      <span className="ach-xp-badge">{ach.xp}</span>
                    </div>
                    <h4 className="ach-card-title">{ach.name}</h4>
                    <p className="ach-card-desc">{ach.description}</p>
                    <div className="ach-card-footer">
                      <span className="ach-issuer">{ach.issuer}</span>
                      <span className="ach-status">
                        {isUnlocked ? "✓ UNLOCKED" : "LOCKED"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
