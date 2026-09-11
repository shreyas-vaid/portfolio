/**
 * Central Portfolio Game State Engine (v2)
 * Manages XP, deterministic level progression, visitor telemetry,
 * inventory unlocks, secret frequencies, and localStorage persistence with v1 migration.
 */

import { saveGameProgress, getGameState } from "../services/api";

const STORAGE_KEY_V1 = "shreyas_os_state_v1";
const STORAGE_KEY_V2 = "shreyas_os_state_v2";
const SESSION_FLAG_KEY = "shreyas_session_active";

export const XP_ACTION_MAP = {
  "visit-profile": 10,
  "visit-skills": 10,
  "open-project": 15,
  "visit-experience": 10,
  "open-inventory": 15,
  "open-radio": 10,
  "open-terminal": 20,
  "discover-secret": 25,
  "unlock-achievement": 30,
  "discover-frequency": 25,
  "unlock-violet": 100
};

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0 },
  { level: 2, minXp: 100 },
  { level: 3, minXp: 250 },
  { level: 4, minXp: 500 },
  { level: 5, minXp: 850 },
  { level: 6, minXp: 1300 },
  { level: 7, minXp: 1850 },
  { level: 8, minXp: 2500 },
  { level: 9, minXp: 3250 },
  { level: 10, minXp: 4100 }
];

function generateAnonymousId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "anon-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 9);
}

class GameStateEngine {
  constructor() {
    this.listeners = new Set();
    this.toastListeners = new Set();
    this.state = this.loadInitialState();

    // Trigger server-sync in background when possible
    if (typeof window !== "undefined") {
      this.syncWithServer();
    }
  }

  getDefaultState() {
    const now = new Date().toISOString();
    return {
      version: 2,
      sessionId: generateAnonymousId(),
      xp: 0,
      level: 1,
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
      discoveredSecrets: [],
      isVioletUnlocked: false,
      activeTheme: "red", // "red" | "violet"
      visitCount: 1,
      firstVisitDate: now,
      lastVisitDate: now,
      sessionStarted: now
    };
  }

  loadInitialState() {
    const defaults = this.getDefaultState();
    if (typeof window === "undefined") return defaults;

    let loadedState = null;

    // 1. Try loading V2 state
    try {
      const savedV2 = localStorage.getItem(STORAGE_KEY_V2);
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        if (parsed && typeof parsed === "object") {
          loadedState = {
            ...defaults,
            ...parsed,
            completedActions: parsed.completedActions || {},
            unlockedItems: Array.isArray(parsed.unlockedItems) ? parsed.unlockedItems : defaults.unlockedItems,
            unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : defaults.unlockedAchievements,
            unlockedFrequencies: Array.isArray(parsed.unlockedFrequencies) ? parsed.unlockedFrequencies : defaults.unlockedFrequencies,
            discoveredSecrets: Array.isArray(parsed.discoveredSecrets) ? parsed.discoveredSecrets : defaults.discoveredSecrets,
            version: 2
          };
        }
      }
    } catch (e) {
      console.warn("[SV-OS] Failed to parse v2 state from localStorage; falling back to migration/defaults.", e);
    }

    // 2. Backward Compatibility: Migrate V1 to V2 if V2 didn't exist
    if (!loadedState) {
      try {
        const savedV1 = localStorage.getItem(STORAGE_KEY_V1);
        if (savedV1) {
          const parsedV1 = JSON.parse(savedV1);
          if (parsedV1 && typeof parsedV1 === "object") {
            loadedState = {
              ...defaults,
              ...parsedV1,
              completedActions: parsedV1.completedActions || {},
              version: 2
            };
            // Persist migrated state immediately
            try {
              localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(loadedState));
            } catch (err) {
              console.warn("[SV-OS] Could not write migrated state to localStorage", err);
            }
          }
        }
      } catch (err) {
        console.warn("[SV-OS] Failed to migrate v1 state from localStorage", err);
      }
    }

    // Fall back to defaults if nothing could be loaded
    if (!loadedState) {
      loadedState = defaults;
    }

    // Ensure level is calculated from XP
    loadedState.level = this.calculateLevel(loadedState.xp);

    // 3. Reliable Visitor Tracking (Prevent multi-increment on hot-reload/re-render)
    try {
      const isSessionActive = sessionStorage.getItem(SESSION_FLAG_KEY);
      if (!isSessionActive) {
        // This is a new browser session
        sessionStorage.setItem(SESSION_FLAG_KEY, "1");
        loadedState.visitCount = (loadedState.visitCount || 0) + 1;
        loadedState.lastVisitDate = new Date().toISOString();
        loadedState.sessionStarted = new Date().toISOString();
      }
    } catch {
      // Ignore sessionStorage errors in restricted environments
    }

    // Save initial state to disk
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(loadedState));
    } catch (e) {
      console.warn("[SV-OS] Could not initialize state in storage", e);
    }

    return loadedState;
  }

  save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(this.state));
    } catch (e) {
      console.warn("[SV-OS] Failed to persist state", e);
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

  // ==========================================
  // LEVEL & XP ENGINE
  // ==========================================

  calculateLevel(xp = 0) {
    const safeXp = Math.max(0, Number(xp) || 0);
    let lvl = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (safeXp >= LEVEL_THRESHOLDS[i].minXp) {
        lvl = LEVEL_THRESHOLDS[i].level;
        break;
      }
    }
    return lvl;
  }

  getProgressToNextLevel() {
    const xp = this.state.xp || 0;
    const currentLevel = this.calculateLevel(xp);
    const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel) || LEVEL_THRESHOLDS[0];
    const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1);

    if (!nextThreshold) {
      return { currentLevel, currentXp: xp, nextLevelXp: xp, progressPercent: 100 };
    }

    const range = nextThreshold.minXp - currentThreshold.minXp;
    const gained = xp - currentThreshold.minXp;
    const progressPercent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));

    return {
      currentLevel,
      currentXp: xp,
      nextLevelXp: nextThreshold.minXp,
      progressPercent
    };
  }

  hasCompletedAction(actionId) {
    return Boolean(this.state.completedActions && this.state.completedActions[actionId]);
  }

  completeAction(actionId) {
    if (!this.state.completedActions) {
      this.state.completedActions = {};
    }
    this.state.completedActions[actionId] = new Date().toISOString();
  }

  /**
   * Award XP safely for a specified action
   * Anti-farming: only awards XP once per actionId.
   */
  awardXP(actionId, amount = null) {
    if (!actionId || this.hasCompletedAction(actionId)) {
      return { success: false, awarded: 0, reason: "already_completed" };
    }

    const reward = amount !== null ? amount : (XP_ACTION_MAP[actionId] || 10);
    this.completeAction(actionId);

    const oldLevel = this.state.level;
    this.state.xp = (this.state.xp || 0) + reward;
    this.state.level = this.calculateLevel(this.state.xp);

    this.showToast(`+${reward} EXP // ${actionId.toUpperCase()}`);

    if (this.state.level > oldLevel) {
      this.showToast(`LEVEL UP! REACHED LEVEL ${this.state.level}`);
    }

    this.notify();

    // Background server progress synchronization
    if (this.state.sessionId) {
      saveGameProgress(this.state.sessionId, actionId).catch(() => {});
    }

    return { success: true, awarded: reward, level: this.state.level };
  }

  // ==========================================
  // INVENTORY & ACHIEVEMENTS
  // ==========================================

  unlockItem(itemId, name = "NEW ITEM") {
    if (!this.state.unlockedItems.includes(itemId)) {
      this.state.unlockedItems.push(itemId);
      this.showToast(`ITEM ACQUIRED: ${name}`);
      this.awardXP(`item-${itemId}`, 15);
      this.notify();
    }
  }

  unlockAchievement(achId, name = "ACHIEVEMENT") {
    if (!this.state.unlockedAchievements.includes(achId)) {
      this.state.unlockedAchievements.push(achId);
      this.showToast(`ACHIEVEMENT CLEARED: ${name}`);
      this.awardXP(`ach-${achId}`, 30);
      this.notify();
    }
  }

  unlockFrequency(freqId) {
    if (!this.state.unlockedFrequencies.includes(freqId)) {
      this.state.unlockedFrequencies.push(freqId);
      this.unlockItem("item-freq-06-tape", "FREQUENCY 06 CASSETTE");
      this.awardXP("discover-frequency", 25);
      this.notify();
    }
  }

  unlockVioletTheme() {
    let newlyUnlocked = false;
    if (!this.state.isVioletUnlocked) {
      this.state.isVioletUnlocked = true;
      newlyUnlocked = true;
      this.unlockItem("item-secret-violet", "SECRET VIOLET CIPHER");
      this.unlockAchievement("ach-exp-violet", "VIOLET PROTOCOL OVERRIDE");
      this.awardXP("unlock-violet", 100);
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

  // ==========================================
  // SERVER SYNCHRONIZATION
  // ==========================================

  async syncWithServer() {
    if (!this.state.sessionId) return;
    try {
      const res = await getGameState(this.state.sessionId);
      if (res && res.success && res.data) {
        const serverData = res.data;
        // Merge completed actions safely
        if (serverData.completedActions) {
          this.state.completedActions = {
            ...this.state.completedActions,
            ...serverData.completedActions
          };
        }
        // If server has more authoritative XP, adopt it
        if (typeof serverData.xp === "number" && serverData.xp > this.state.xp) {
          this.state.xp = serverData.xp;
          this.state.level = this.calculateLevel(this.state.xp);
        }
        this.notify();
      }
    } catch {
      // Offline fallback: continue using localStorage silently
    }
  }
}

export const gameState = new GameStateEngine();
