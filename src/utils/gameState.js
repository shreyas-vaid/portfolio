/**
 * Central Game State & Progress Engine
 * Manages XP, ranks, achievements, inventory, secrets, theme, and localStorage persistence.
 */

const STORAGE_KEY = "shreyas_os_state_v1";

export const LEVEL_TIERS = [
  { level: 1, title: "INITIALIZE", minXP: 0, maxXP: 150 },
  { level: 2, title: "EXPLORER", minXP: 150, maxXP: 350 },
  { level: 3, title: "SYSTEM USER", minXP: 350, maxXP: 600 },
  { level: 4, title: "DATA RUNNER", minXP: 600, maxXP: 900 },
  { level: 5, title: "BACKEND OPERATIVE", minXP: 900, maxXP: 1250 },
  { level: 6, title: "SYSTEM ARCHITECT", minXP: 1250, maxXP: 2000 }
];

class GameStateEngine {
  constructor() {
    this.listeners = new Set();
    this.toastListeners = new Set();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const defaultState = {
      xp: 0,
      completedActions: {},
      unlockedItems: [
        "item-python",
        "item-sql",
        "item-flask",
        "item-streamlit",
        "item-data-analysis",
        "item-linux",
        "item-git",
        "item-sales-dashboard",
        "item-cyberpunk-portfolio",
        "item-thinknext-badge",
        "item-chandigarh-univ"
      ],
      unlockedAchievements: [
        "ach-real-intern-month",
        "ach-real-data-analyst",
        "ach-real-sales-dashboard",
        "ach-real-backend",
        "ach-real-python",
        "ach-real-cu"
      ],
      unlockedFrequencies: ["freq-01", "freq-02", "freq-03", "freq-04", "freq-05"],
      isVioletUnlocked: false,
      activeTheme: "red", // "red" | "violet"
      visitCount: 0,
      firstVisitDate: new Date().toISOString()
    };

    if (typeof window === "undefined") return defaultState;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          visitCount: (parsed.visitCount || 0) + 1
        };
      }
    } catch (e) {
      console.warn("Failed to load saved game state", e);
    }

    return defaultState;
  }

  save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Failed to persist state", e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeToasts(listener) {
    this.toastListeners.add(listener);
    return () => this.toastListeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn({ ...this.state }));
    this.save();
  }

  showToast(message, xp = null) {
    this.toastListeners.forEach((fn) => fn({ message, xp, id: Date.now() + Math.random() }));
  }

  /**
   * Award XP safely without farming
   */
  awardXP(actionKey, amount, label = "DISCOVERY") {
    if (this.state.completedActions[actionKey]) return; // Already completed

    this.state.completedActions[actionKey] = true;
    this.state.xp += amount;

    this.showToast(`${label} (+${amount} XP)`, amount);
    this.notify();
  }

  /**
   * Unlock an inventory item
   */
  unlockItem(itemId, name = "NEW ITEM") {
    if (!this.state.unlockedItems.includes(itemId)) {
      this.state.unlockedItems.push(itemId);
      this.awardXP(`item_unlock_${itemId}`, 30, `ITEM DISCOVERED: ${name}`);
      this.notify();
    }
  }

  /**
   * Unlock an achievement
   */
  unlockAchievement(achId, name = "ACHIEVEMENT") {
    if (!this.state.unlockedAchievements.includes(achId)) {
      this.state.unlockedAchievements.push(achId);
      this.showToast(`🏆 UNLOCKED: ${name}`, 25);
      this.notify();
    }
  }

  /**
   * Unlock secret Frequency 06
   */
  unlockFrequency(freqId) {
    if (!this.state.unlockedFrequencies.includes(freqId)) {
      this.state.unlockedFrequencies.push(freqId);
      this.awardXP(`freq_unlock_${freqId}`, 20, "SECRET FREQUENCY SYNCED");
      this.unlockItem("item-freq-06-tape", "FREQUENCY 06 CASSETTE");
      this.notify();
    }
  }

  /**
   * Unlock the secret NIGHT // VIOLET theme
   */
  unlockVioletTheme() {
    let newlyUnlocked = false;
    if (!this.state.isVioletUnlocked) {
      this.state.isVioletUnlocked = true;
      newlyUnlocked = true;
      this.awardXP("secret_violet_theme", 100, "SECRET: NIGHT // VIOLET PROTOCOL");
      this.unlockItem("item-secret-violet", "SECRET VIOLET CIPHER");
      this.unlockAchievement("ach-exp-violet", "VIOLET PROTOCOL OVERRIDE");
    }

    this.setTheme("violet");
    return newlyUnlocked;
  }

  setTheme(theme) {
    this.state.activeTheme = theme;
    if (typeof document !== "undefined") {
      if (theme === "violet") {
        document.documentElement.setAttribute("data-theme", "violet");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
    this.notify();
  }

  getCurrentLevel() {
    const xp = this.state.xp;
    let currentTier = LEVEL_TIERS[0];
    for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_TIERS[i].minXP) {
        currentTier = LEVEL_TIERS[i];
        break;
      }
    }
    return currentTier;
  }

  getNextLevelXP() {
    const current = this.getCurrentLevel();
    return current.maxXP;
  }
}

export const gameState = new GameStateEngine();
