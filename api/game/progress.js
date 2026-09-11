import { parseRequestBody, recordGameProgress, sendJsonResponse } from "../../server/lib/portfolioBackend.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJsonResponse(res, 405, {
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only POST requests are allowed." }
    });
  }

  const body = await parseRequestBody(req);
  if (!body) {
    return sendJsonResponse(res, 400, {
      success: false,
      error: { code: "INVALID_JSON", message: "Malformed JSON payload in request body." }
    });
  }

  const { sessionId, action } = body;
  const result = recordGameProgress(sessionId, action);

  const statusCode = result.success ? 200 : 400;
  return sendJsonResponse(res, statusCode, result);
}
