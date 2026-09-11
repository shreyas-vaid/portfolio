import {
  getServerGameState,
  isValidSessionId,
  sendJsonResponse,
  generateRequestId,
  logEvent
} from "../../server/lib/portfolioBackend.js";

export default function handler(req, res) {
  const reqId = generateRequestId();
  logEvent(reqId, `${req.method} /api/game/state`);

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJsonResponse(res, 405, {
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET requests are allowed." }
    }, reqId);
  }

  let sessionId = "";
  if (req.query && req.query.sessionId) {
    sessionId = String(req.query.sessionId).trim();
  } else if (req.url) {
    try {
      const url = new URL(req.url, "http://localhost");
      sessionId = String(url.searchParams.get("sessionId") || "").trim();
    } catch {
      sessionId = "";
    }
  }

  if (!isValidSessionId(sessionId)) {
    return sendJsonResponse(res, 400, {
      success: false,
      error: { code: "INVALID_SESSION", message: "A valid UUID session ID is required." }
    }, reqId);
  }

  const state = getServerGameState(sessionId);
  return sendJsonResponse(res, 200, {
    success: true,
    data: state
  }, reqId, false);
}
