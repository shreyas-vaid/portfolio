import { getHealthData, sendJsonResponse } from "../server/lib/portfolioBackend.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return sendJsonResponse(res, 405, {
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only GET requests are allowed." }
    });
  }
  return sendJsonResponse(res, 200, getHealthData());
}
