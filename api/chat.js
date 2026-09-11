import { parseRequestBody, processChatRequest, sendJsonResponse } from "../server/lib/portfolioBackend.js";

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

  const { message, sessionId } = body;
  const clientIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";

  try {
    const result = await processChatRequest({ message, sessionId, clientIp });
    return sendJsonResponse(res, result.statusCode, result.body);
  } catch (err) {
    console.error("[Chat Endpoint Error]:", err?.message || err);
    return sendJsonResponse(res, 500, {
      success: false,
      error: {
        code: "CHAT_UNAVAILABLE",
        message: "The companion is temporarily offline."
      }
    });
  }
}
