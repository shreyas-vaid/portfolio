import { getProjectsData, sendJsonResponse, generateRequestId, logEvent } from "../server/lib/portfolioBackend.js";

export default function handler(req, res) {
  const reqId = generateRequestId();
  logEvent(reqId, `${req.method} /api/projects`);

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJsonResponse(res, 405, {
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET requests are allowed." }
    }, reqId);
  }

  return sendJsonResponse(res, 200, getProjectsData(), reqId, true);
}
