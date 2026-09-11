/**
 * Canonical XP Action Registry and Deterministic Level Progression Configuration
 * Single authoritative source of truth for both client and server.
 */

export const XP_ACTIONS = Object.freeze({
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
});

export const LEVEL_THRESHOLDS = Object.freeze([
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
]);

/**
 * Deterministic level calculation from XP
 */
export function calculateLevel(xp = 0) {
  const safeXp = Math.max(0, Math.floor(Number(xp) || 0));
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (safeXp >= LEVEL_THRESHOLDS[i].minXp) {
      level = LEVEL_THRESHOLDS[i].level;
      break;
    }
  }
  return level;
}

/**
 * Get progress details toward the next level
 */
export function getProgressToNextLevel(xp = 0) {
  const safeXp = Math.max(0, Math.floor(Number(xp) || 0));
  const currentLevel = calculateLevel(safeXp);
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel) || LEVEL_THRESHOLDS[0];
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);

  if (!nextThreshold) {
    return { currentLevel, currentXp: safeXp, nextLevelXp: safeXp, progressPercent: 100 };
  }

  const range = nextThreshold.minXp - currentThreshold.minXp;
  const gained = safeXp - currentThreshold.minXp;
  const percent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));

  return {
    currentLevel,
    currentXp: safeXp,
    nextLevelXp: nextThreshold.minXp,
    progressPercent: percent
  };
}

/**
 * Authoritatively calculate total XP strictly from a validated map or array of completed actions.
 * Prevents arbitrary XP injection by ignoring any action not in XP_ACTIONS.
 */
export function calculateTotalXpFromActions(completedActions = {}) {
  if (!completedActions || typeof completedActions !== "object") return 0;
  let total = 0;
  const actions = Array.isArray(completedActions)
    ? completedActions
    : Object.keys(completedActions);

  for (const action of actions) {
    if (typeof action === "string" && Object.prototype.hasOwnProperty.call(XP_ACTIONS, action)) {
      total += XP_ACTIONS[action];
    }
  }
  return total;
}
