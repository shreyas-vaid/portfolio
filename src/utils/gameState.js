/**
 * Central Portfolio Game State Engine (v2)
 * Manages XP, deterministic level progression, visitor telemetry,
 * inventory unlocks, secret frequencies, and localStorage persistence with v1 migration.
 * Authoritative XP action rewards consumed from canonical xpConfig.
 */

import { saveGameProgress, getGameState } from "../services/api";
import {
  XP_ACTIONS,
  LEVEL_THRESHOLDS,
  calculateLevel,
  getProgressToNextLevel,
  calculateTotalXpFromActions
} from "../data/xpConfig";

const STORAGE_KEY_V1 = "shreyas_os_state_v1";
const STORAGE_KEY_V2 = "shreyas_os_state_v2";
const SESSION_FLAG_KEY = "shreyas_session_active";

function isValidUuid(id) {
  if (!id || typeof id !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function generateAnonymousId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Safe RFC4122 compliant fallback
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

class GameStateEngine {
  constructor() {
    this.listeners = new Set();
    this.toastListeners = new Set();
    this.state = this.loadInitialState();

    // Trigger server-sync in background when browser is available
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

    if (!loadedState) {
      loadedState = defaults;
    }

    // 3. Strict State Sanitization
    if (!isValidUuid(loadedState.sessionId)) {
      loadedState.sessionId = generateAnonymousId();
    }

    const safeXp = Math.max(0, Math.floor(Number(loadedState.xp) || 0));
    loadedState.xp = safeXp;
    loadedState.level = calculateLevel(safeXp);

    if (loadedState.activeTheme !== "violet") {
      loadedState.activeTheme = "red";
    }

    if (!Array.isArray(loadedState.unlockedItems)) {
      loadedState.unlockedItems = defaults.unlockedItems;
    }
    if (!Array.isArray(loadedState.unlockedAchievements)) {
      loadedState.unlockedAchievements = defaults.unlockedAchievements;
    }
    if (!Array.isArray(loadedState.unlockedFrequencies)) {
      loadedState.unlockedFrequencies = defaults.unlockedFrequencies;
    }
    if (!Array.isArray(loadedState.discoveredSecrets)) {
      loadedState.discoveredSecrets = [];
    }
    if (!loadedState.completedActions || typeof loadedState.completedActions !== "object" || Array.isArray(loadedState.completedActions)) {
      loadedState.completedActions = {};
    }

    loadedState.visitCount = Math.max(1, Math.floor(Number(loadedState.visitCount) || 1));

    // 4. Reliable Visitor Tracking (Once per actual browser session)
    try {
      const isSessionActive = sessionStorage.getItem(SESSION_FLAG_KEY);
      if (!isSessionActive) {
        sessionStorage.setItem(SESSION_FLAG_KEY, "1");
        loadedState.visitCount = loadedState.visitCount + 1;
        loadedState.lastVisitDate = new Date().toISOString();
        loadedState.sessionStarted = new Date().toISOString();
      }
    } catch {
      // Ignore sessionStorage restrictions
    }

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
  // AUTHORITATIVE LEVEL & XP ENGINE
  // ==========================================

  calculateLevel(xp = 0) {
    return calculateLevel(xp);
  }

  getProgressToNextLevel() {
    return getProgressToNextLevel(this.state.xp || 0);
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
   * Award XP strictly via canonical action identifiers.
   * Arbitrary custom amounts are NOT accepted.
   */
  awardXP(actionId) {
    if (!actionId || typeof actionId !== "string") {
      return { success: false, awarded: 0, reason: "invalid_action" };
    }

    // Must be a recognized canonical action
    if (!Object.prototype.hasOwnProperty.call(XP_ACTIONS, actionId)) {
      return { success: false, awarded: 0, reason: "unrecognized_action" };
    }

    if (this.hasCompletedAction(actionId)) {
      return { success: false, awarded: 0, reason: "already_completed" };
    }

    const reward = XP_ACTIONS[actionId];
    this.completeAction(actionId);

    const oldLevel = this.state.level;
    this.state.xp = (this.state.xp || 0) + reward;
    this.state.level = calculateLevel(this.state.xp);

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
      if (itemId === "item-coffee-thermos") {
        this.awardXP("discover-secret");
      } else {
        this.awardXP("open-inventory");
      }
      this.notify();
    }
  }

  unlockAchievement(achId, name = "ACHIEVEMENT") {
    if (!this.state.unlockedAchievements.includes(achId)) {
      this.state.unlockedAchievements.push(achId);
      this.showToast(`ACHIEVEMENT CLEARED: ${name}`);
      this.awardXP("unlock-achievement");
      this.notify();
    }
  }

  unlockFrequency(freqId) {
    if (!this.state.unlockedFrequencies.includes(freqId)) {
      this.state.unlockedFrequencies.push(freqId);
      this.unlockItem("item-freq-06-tape", "FREQUENCY 06 CASSETTE");
      this.awardXP("discover-frequency");
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
      this.awardXP("unlock-violet");
    }

    this.setTheme("violet");
    return newlyUnlocked;
  }

  setTheme(theme) {
    const validTheme = theme === "violet" ? "violet" : "red";
    this.state.activeTheme = validTheme;
    if (typeof document !== "undefined") {
      if (validTheme === "violet") {
        document.documentElement.setAttribute("data-theme", "violet");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
    this.notify();
  }

  // ==========================================
  // SAFE SERVER SYNCHRONIZATION
  // ==========================================

  async syncWithServer() {
    if (!this.state.sessionId) return;
    try {
      const res = await getGameState(this.state.sessionId);
      if (res && res.success && res.data) {
        const serverData = res.data;
        // Merge completed actions safely (union of verified action keys)
        if (serverData.completedActions && typeof serverData.completedActions === "object") {
          const mergedActions = { ...this.state.completedActions };
          for (const [action, ts] of Object.entries(serverData.completedActions)) {
            if (Object.prototype.hasOwnProperty.call(XP_ACTIONS, action) && !mergedActions[action]) {
              mergedActions[action] = ts;
            }
          }
          this.state.completedActions = mergedActions;
        }

        // Authoritative XP derivation: calculate total strictly from verified completed actions
        const verifiedTotalXp = calculateTotalXpFromActions(this.state.completedActions);
        this.state.xp = verifiedTotalXp;
        this.state.level = calculateLevel(verifiedTotalXp);

        this.notify();
      }
    } catch {
      // Offline fallback: continue using localStorage silently
    }
  }
}

export { XP_ACTIONS, LEVEL_THRESHOLDS };
export const gameState = new GameStateEngine();
