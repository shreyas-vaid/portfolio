/**
 * Central Portfolio Interactive State Engine
 * Manages inventory items, secret frequencies, active theme, and localStorage persistence.
 * (Viewer EXP system removed for a slick, clean experience).
 */

const STORAGE_KEY = "shreyas_os_state_v1";

class GameStateEngine {
  constructor() {
    this.listeners = new Set();
    this.toastListeners = new Set();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const defaultState = {
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
      console.warn("Failed to load saved state", e);
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

  showToast(message) {
    this.toastListeners.forEach((fn) => fn({ message, id: Date.now() + Math.random() }));
  }

  /**
   * Unlock an inventory item
   */
  unlockItem(itemId, name = "NEW ITEM") {
    if (!this.state.unlockedItems.includes(itemId)) {
      this.state.unlockedItems.push(itemId);
      this.notify();
    }
  }

  /**
   * Unlock an achievement
   */
  unlockAchievement(achId, name = "ACHIEVEMENT") {
    if (!this.state.unlockedAchievements.includes(achId)) {
      this.state.unlockedAchievements.push(achId);
      this.notify();
    }
  }

  /**
   * Unlock secret Frequency 06
   */
  unlockFrequency(freqId) {
    if (!this.state.unlockedFrequencies.includes(freqId)) {
      this.state.unlockedFrequencies.push(freqId);
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
}

export const gameState = new GameStateEngine();

