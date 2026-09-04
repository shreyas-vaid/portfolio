import { useState, useEffect } from "react";
import { inventoryItems, INVENTORY_CATEGORIES } from "../../data/inventoryData";
import { gameState } from "../../utils/gameState";
import "./inventory.css";

export default function InventoryModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(inventoryItems[0]);
  const [unlockedList, setUnlockedList] = useState(gameState.state.unlockedItems);

  useEffect(() => {
    const unsub = gameState.subscribe((st) => {
      setUnlockedList(st.unlockedItems);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen) {
      gameState.unlockAchievement("ach-exp-inventory", "QUARTERMASTER");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = inventoryItems.filter(
    (item) => activeCategory === "ALL" || item.category === activeCategory
  );

  return (
    <div className="inv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="inv-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="inv-modal-header">
          <div className="inv-header-title-wrap">
            <span className="inv-header-badge">CACHE-01</span>
            <h3 className="inv-header-title">TACTICAL INVENTORY & MODULES</h3>
          </div>
          <button type="button" className="inv-close-btn" onClick={onClose} aria-label="Close Inventory">
            ✕ CLOSE
          </button>
        </div>

        {/* Category Tabs */}
        <div className="inv-categories-bar">
          {INVENTORY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`inv-category-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Body Layout */}
        <div className="inv-modal-body">
          {/* Items Grid */}
          <div className="inv-items-grid">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedList.includes(item.id);
              const isSelected = selectedItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`inv-item-card rarity-${item.rarity.toLowerCase()} ${
                    isSelected ? "selected" : ""
                  } ${!isUnlocked ? "locked" : ""}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="inv-item-icon">{isUnlocked ? item.icon : "🔒"}</div>
                  <div className="inv-item-info">
                    <div className="inv-item-name">{isUnlocked ? item.name : "??? CLASSIFIED"}</div>
                    <div className="inv-item-tier">
                      <span className="inv-rarity-tag">{item.rarity}</span>
                      <span>{item.level}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Item Inspection Dossier */}
          <div className="inv-inspect-panel">
            {selectedItem ? (
              (() => {
                const isUnlocked = unlockedList.includes(selectedItem.id);
                return (
                  <div className="inv-inspect-card">
                    <div className="inv-inspect-header">
                      <span className="inv-inspect-icon">{isUnlocked ? selectedItem.icon : "🔒"}</span>
                      <div>
                        <h4 className="inv-inspect-name">
                          {isUnlocked ? selectedItem.name : "??? UNKNOWN ITEM"}
                        </h4>
                        <div className="inv-inspect-badge-row">
                          <span className={`inv-rarity-badge rarity-${selectedItem.rarity.toLowerCase()}`}>
                            {selectedItem.rarity}
                          </span>
                          <span className="inv-inspect-cat">{selectedItem.category} // {selectedItem.level}</span>
                        </div>
                      </div>
                    </div>

                    <div className="inv-inspect-divider" />

                    <div className="inv-inspect-desc">
                      {isUnlocked
                        ? selectedItem.description
                        : selectedItem.secretHint || "Discovery condition not met. Explore the developer terminal, radio, and secrets."}
                    </div>

                    {isUnlocked && selectedItem.attributes && (
                      <div className="inv-attributes-section">
                        <span className="inv-attr-title">ATTRIBUTES & CAPABILITIES:</span>
                        <div className="inv-attr-chips">
                          {selectedItem.attributes.map((attr, i) => (
                            <span key={i} className="inv-attr-chip">
                              + {attr}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="inv-inspect-status">
                      STATUS:{" "}
                      <span style={{ color: isUnlocked ? "#00ff66" : "var(--accent-red-bright)" }}>
                        {isUnlocked ? "EQUIPPED // ACTIVE IN CORE" : "LOCKED // DISCOVERY PENDING"}
                      </span>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="inv-inspect-empty">Select an item to inspect its module properties.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
