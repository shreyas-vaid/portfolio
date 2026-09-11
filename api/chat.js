import {
  parseRequestBody,
  validateJsonContentType,
  getClientIp,
  processChatRequest,
  sendJsonResponse,
  generateRequestId,
  logEvent
} from "../server/lib/portfolioBackend.js";

export default async function handler(req, res) {
  const reqId = generateRequestId();
  logEvent(reqId, `${req.method} /api/chat`);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJsonResponse(res, 405, {
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "Only POST requests are allowed." }
    }, reqId);
  }

  if (!validateJsonContentType(req)) {
    return sendJsonResponse(res, 415, {
      success: false,
      error: { code: "INVALID_CONTENT_TYPE", message: "Content-Type must be application/json." }
    }, reqId);
  }

  const parsed = await parseRequestBody(req);
  if (parsed.error) {
    const status = parsed.statusCode || 400;
    const msg = parsed.error === "PAYLOAD_TOO_LARGE"
      ? "Payload exceeds maximum allowable size (32 KB)."
      : "Malformed JSON payload in request body.";
    return sendJsonResponse(res, status, {
      success: false,
      error: { code: parsed.error, message: msg }
    }, reqId);
  }

  const body = parsed.data || {};
  const { message, sessionId } = body;
  const clientIp = getClientIp(req);

  try {
    const result = await processChatRequest({ message, sessionId, clientIp, reqId });
    return sendJsonResponse(res, result.statusCode, result.body, reqId, false);
  } catch (err) {
    logEvent(reqId, "UNHANDLED_CHAT_ERROR", err?.message || "Internal server error");
    return sendJsonResponse(res, 500, {
      success: false,
      error: {
        code: "CHAT_UNAVAILABLE",
        message: "The companion is temporarily offline."
      }
    }, reqId, false);
  }
}
