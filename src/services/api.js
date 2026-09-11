/**
 * Central Portfolio API Client Service
 * Encapsulates network operations, error handling, and offline resilience.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function fetchWithTimeout(endpoint, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data?.error || {
          code: "REQUEST_FAILED",
          message: `Request failed with status ${response.status}`
        }
      };
    }

    return data || { success: true };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      offline: true,
      error: {
        code: err.name === "AbortError" ? "TIMEOUT" : "NETWORK_OFFLINE",
        message: "Communication link offline or network unavailable."
      }
    };
  }
}

/**
 * Health Check Endpoint
 */
export async function getHealth() {
  return fetchWithTimeout("/api/health", { method: "GET" }, 5000);
}

/**
 * Verified Profile Information
 */
export async function getProfile() {
  return fetchWithTimeout("/api/profile", { method: "GET" });
}

/**
 * Verified Quest Projects
 */
export async function getProjects() {
  return fetchWithTimeout("/api/projects", { method: "GET" });
}

/**
 * Verified Operational History & Experience
 */
export async function getExperience() {
  return fetchWithTimeout("/api/experience", { method: "GET" });
}

/**
 * Synchronize or Fetch Server Game State
 */
export async function getGameState(sessionId) {
  if (!sessionId) return { success: false, error: { code: "NO_SESSION", message: "No session ID" } };
  const query = `?sessionId=${encodeURIComponent(sessionId)}`;
  return fetchWithTimeout(`/api/game/state${query}`, { method: "GET" });
}

/**
 * Synchronize Game Progress to Server
 * Client never sends arbitrary XP; awards are calculated by the server.
 */
export async function saveGameProgress(sessionId, action) {
  if (!sessionId || !action) {
    return { success: false, error: { code: "INVALID_ARGS", message: "Missing sessionId or action" } };
  }

  return fetchWithTimeout("/api/game/progress", {
    method: "POST",
    body: JSON.stringify({ sessionId, action })
  });
}

/**
 * Send Message to Chibi AI Companion (SV-01)
 */
export async function sendChatMessage(sessionId, message) {
  if (!message || typeof message !== "string") {
    return {
      success: false,
      error: { code: "EMPTY_MESSAGE", message: "Message cannot be empty." }
    };
  }

  return fetchWithTimeout("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      sessionId: sessionId || "anonymous",
      message: message.trim()
    })
  }, 12000);
}
