import { getServerGameState, sendJsonResponse } from "../../server/lib/portfolioBackend.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return sendJsonResponse(res, 405, {
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET requests are allowed." }
    });
  }

  let sessionId = "";
  if (req.query && req.query.sessionId) {
    sessionId = req.query.sessionId;
  } else if (req.url) {
    try {
      const url = new URL(req.url, "http://localhost");
      sessionId = url.searchParams.get("sessionId") || "";
    } catch {
      sessionId = "";
    }
  }

  const state = getServerGameState(sessionId);
  return sendJsonResponse(res, 200, {
    success: true,
    data: state
  });
}
