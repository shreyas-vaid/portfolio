/**
 * Core Portfolio Backend Engine (Hardened Edition)
 * Canonical data providers, security headers, dual rate limiting,
 * deterministic XP engine, UUID validation, and Chibi AI companion service.
 */

import { profileData } from "../../src/data/profile.js";
import { personalProfile } from "../../src/data/personalProfile.js";
import { questProjects } from "../../src/data/projects.js";
import { missionHistory } from "../../src/data/experience.js";
import { abilityCategories } from "../../src/data/skills.js";
import {
  XP_ACTIONS,
  LEVEL_THRESHOLDS,
  calculateLevel,
  getProgressToNextLevel,
  calculateTotalXpFromActions
} from "../../src/data/xpConfig.js";

// ==========================================
// 1. REQUEST IDENTIFIERS & LOGGING
// ==========================================

export function generateRequestId() {
  const timestamp = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${rand}`;
}

export function logEvent(reqId, event, details = "") {
  const time = new Date().toISOString();
  console.log(`[${time}] [${reqId || "sys"}] ${event}${details ? ` - ${details}` : ""}`);
}

// ==========================================
// 2. SECURITY HEADERS & CONTENT SECURITY POLICY
// ==========================================

const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://generativelanguage.googleapis.com",
  "media-src 'self' data: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'"
].join("; ");

export function applySecurityHeaders(res, reqId) {
  if (!res || !res.setHeader) return;
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", CSP_POLICY);

  if (reqId) {
    res.setHeader("X-Request-ID", reqId);
  }
}

export function applyCacheHeaders(res, isStatic = false) {
  if (!res || !res.setHeader) return;
  if (isStatic) {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
  } else {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
}

export function sendJsonResponse(res, statusCode, data, reqId, isStatic = false) {
  applySecurityHeaders(res, reqId);
  applyCacheHeaders(res, isStatic);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

// ==========================================
// 3. CLIENT IP & DUAL RATE LIMITING
// ==========================================

export function getClientIp(req) {
  if (!req) return "127.0.0.1";
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    // Take first client IP in comma-separated proxy list
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp && firstIp.length <= 45) {
      return firstIp;
    }
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || "127.0.0.1";
}

const rateLimitBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkRateLimit(key, maxRequests = 20) {
  const now = Date.now();
  let bucket = rateLimitBuckets.get(key);

  if (!bucket || now - bucket.startTime > RATE_LIMIT_WINDOW_MS) {
    bucket = { startTime: now, count: 1 };
    rateLimitBuckets.set(key, bucket);
    return { allowed: true, remaining: maxRequests - 1 };
  }

  bucket.count += 1;
  if (bucket.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - bucket.count };
}

/**
 * Dual rate limiter checking both IP address and session ID
 * Protects against session ID rotation bypass
 */
export function checkDualRateLimit(ip, sessionId) {
  const ipKey = `ip:${ip || "unknown"}`;
  const ipCheck = checkRateLimit(ipKey, 30); // 30 requests per 10 min per IP
  if (!ipCheck.allowed) {
    return { allowed: false, reason: "ip_limit_exceeded" };
  }

  if (sessionId) {
    const sessionKey = `sess:${sessionId}`;
    const sessionCheck = checkRateLimit(sessionKey, 20); // 20 requests per 10 min per session
    if (!sessionCheck.allowed) {
      return { allowed: false, reason: "session_limit_exceeded" };
    }
  }

  return { allowed: true };
}

// Stale rate-limit bucket cleanup timer
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateLimitBuckets.entries()) {
      if (now - bucket.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitBuckets.delete(key);
      }
    }
  }, 10 * 60 * 1000);
  if (cleanupTimer && cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

// ==========================================
// 4. REQUEST BODY PARSING & LIMITS (32 KB)
// ==========================================

const MAX_BODY_BYTES = 32 * 1024; // 32 KB limit

export function validateJsonContentType(req) {
  const contentType = req.headers?.["content-type"] || "";
  return contentType.toLowerCase().includes("application/json");
}

export async function parseRequestBody(req) {
  // Early Content-Length check
  const contentLength = req.headers?.["content-length"];
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    if (typeof req.resume === "function") req.resume();
    return { error: "PAYLOAD_TOO_LARGE", statusCode: 413 };
  }

  // Pre-parsed body (Vercel serverless / Express)
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") {
      if (req.body.length > MAX_BODY_BYTES) {
        return { error: "PAYLOAD_TOO_LARGE", statusCode: 413 };
      }
      try {
        return { data: JSON.parse(req.body) };
      } catch {
        return { error: "INVALID_JSON", statusCode: 400 };
      }
    }
    if (typeof req.body === "object") {
      return { data: req.body };
    }
  }

  // Native Node.js stream body parsing with strict 32 KB byte cap
  return new Promise((resolve) => {
    let raw = "";
    let byteCount = 0;
    let exceeded = false;

    req.on("data", (chunk) => {
      if (exceeded) return;
      byteCount += chunk.length;
      if (byteCount > MAX_BODY_BYTES) {
        exceeded = true;
        if (typeof req.resume === "function") req.resume();
        resolve({ error: "PAYLOAD_TOO_LARGE", statusCode: 413 });
        return;
      }
      raw += chunk;
    });

    req.on("end", () => {
      if (exceeded) return;
      if (!raw.trim()) {
        resolve({ data: {} });
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        resolve({ data: parsed });
      } catch {
        resolve({ error: "INVALID_JSON", statusCode: 400 });
      }
    });

    req.on("error", () => {
      resolve({ error: "REQUEST_ABORTED", statusCode: 400 });
    });
  });
}

// ==========================================
// 5. SESSION VALIDATION & RUNTIME CACHE
// ==========================================

export function isValidSessionId(sessionId) {
  if (!sessionId || typeof sessionId !== "string") return false;
  if (sessionId.length !== 36) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId);
}

// In-memory runtime session cache (NOT a persistent database; localStorage is authoritative)
const serverGameSessions = new Map();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_SESSIONS_CAP = 2000;

function cleanupOldSessions() {
  const now = Date.now();
  for (const [id, s] of serverGameSessions.entries()) {
    if (now - s.lastAccessed > SESSION_TTL_MS) {
      serverGameSessions.delete(id);
    }
  }
}

if (typeof setInterval !== "undefined") {
  const sessionCleaner = setInterval(cleanupOldSessions, 30 * 60 * 1000);
  if (sessionCleaner && sessionCleaner.unref) {
    sessionCleaner.unref();
  }
}

export function getServerGameState(sessionId) {
  if (!isValidSessionId(sessionId)) {
    return null;
  }

  let session = serverGameSessions.get(sessionId);
  if (!session) {
    if (serverGameSessions.size >= MAX_SESSIONS_CAP) {
      cleanupOldSessions();
    }
    session = {
      sessionId,
      version: 2,
      xp: 0,
      level: 1,
      completedActions: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastAccessed: Date.now()
    };
    serverGameSessions.set(sessionId, session);
  } else {
    session.lastAccessed = Date.now();
  }

  // Ensure XP and level are derived authoritatively from validated completedActions
  session.xp = calculateTotalXpFromActions(session.completedActions);
  session.level = calculateLevel(session.xp);

  return session;
}

export function recordGameProgress(sessionId, action) {
  if (!isValidSessionId(sessionId)) {
    return {
      success: false,
      statusCode: 400,
      error: { code: "INVALID_SESSION", message: "A valid UUID session ID is required." }
    };
  }

  if (!action || typeof action !== "string" || !Object.prototype.hasOwnProperty.call(XP_ACTIONS, action)) {
    return {
      success: false,
      statusCode: 400,
      error: { code: "INVALID_ACTION", message: `Action '${action}' is not a recognized canonical action.` }
    };
  }

  const session = getServerGameState(sessionId);

  // Deduplication check
  if (session.completedActions[action]) {
    return {
      success: true,
      statusCode: 200,
      data: {
        awarded: 0,
        reason: "already_completed",
        currentXp: session.xp,
        level: session.level,
        completedActions: session.completedActions
      }
    };
  }

  // Record action timestamp and calculate authoritative reward
  const award = XP_ACTIONS[action];
  session.completedActions[action] = new Date().toISOString();
  session.xp = calculateTotalXpFromActions(session.completedActions);
  session.level = calculateLevel(session.xp);
  session.updatedAt = new Date().toISOString();

  return {
    success: true,
    statusCode: 200,
    data: {
      awarded: award,
      reason: "action_completed",
      currentXp: session.xp,
      level: session.level,
      completedActions: session.completedActions
    }
  };
}

// ==========================================
// 6. CANONICAL PORTFOLIO DATA CONTROLLERS
// ==========================================

export function getHealthData() {
  return {
    success: true,
    status: "ok",
    service: "shreyas-portfolio-api",
    version: "1.0.0"
  };
}

export function getProfileData() {
  return {
    success: true,
    data: {
      name: profileData.name,
      title: profileData.title,
      classType: profileData.classType,
      role: profileData.role,
      location: profileData.location,
      summary: profileData.summary,
      stats: profileData.stats,
      identityDetails: profileData.identityDetails
    }
  };
}

export function getProjectsData() {
  return {
    success: true,
    data: questProjects
  };
}

export function getExperienceData() {
  return {
    success: true,
    data: missionHistory
  };
}

// ==========================================
// 7. AI COMPANION KNOWLEDGE BASE & SERVICE
// ==========================================

/**
 * Builds verified factual knowledge context directly from canonical repository data.
 * Zero hardcoded duplication.
 */
export function buildKnowledgeContext() {
  const edu = profileData.identityDetails?.education || {};
  const skillsSummary = abilityCategories
    .map((c) => `${c.title}: ${c.skills.map((s) => s.name).join(", ")}`)
    .join("\n");

  const projectsSummary = questProjects
    .map((p) => `[${p.questCode}] ${p.title} (${p.subtitle}): ${p.technologies.join(", ")}`)
    .join("\n");

  const experienceSummary = missionHistory
    .map((m) => `${m.role} at ${m.organization} (${m.period}): ${m.description}`)
    .join("\n");

  return `
[PROFESSIONAL IDENTITY]
- Candidate: ${profileData.name}
- Title / Role: ${profileData.title} // ${profileData.role}
- Degree: ${edu.degree || "Bachelor of Engineering (Computer Science)"}
- Institution: ${edu.institution || "Chandigarh University"}
- Timeline & Performance: ${edu.year || "Expected May 2028 · CGPA 7.02"}

[VERIFIED EXPERIENCE & INTERNSHIP]
${experienceSummary}

[TECHNICAL SKILLS]
${skillsSummary}

[VERIFIED QUEST PROJECTS]
${projectsSummary}

[PERSONAL PROFILE (FACTUAL TRIVIA ONLY)]
- Interests: ${personalProfile.interests?.join("; ") || "None indexed"}
- Goals: ${personalProfile.goals?.join("; ") || "None indexed"}
- Verified Facts: ${personalProfile.funFacts?.join("; ") || "None indexed"}
- Music Preferences: ${personalProfile.music && personalProfile.music.length ? personalProfile.music.join("; ") : "UNINDEXED"}
- Food / Dining Preferences: ${personalProfile.food && personalProfile.food.length ? personalProfile.food.join("; ") : "UNINDEXED"}
- Personal Hobbies: ${personalProfile.hobbies && personalProfile.hobbies.length ? personalProfile.hobbies.join("; ") : "UNINDEXED"}
- Personality: ${personalProfile.personality && personalProfile.personality.length ? personalProfile.personality.join("; ") : "UNINDEXED"}
`.trim();
}

function buildSystemPrompt() {
  const context = buildKnowledgeContext();
  return `### SYSTEM DIRECTIVES
You are SV-01, the interactive tactical digital companion for Shreyas Vaid's developer portfolio.
Your role: Answer visitor queries concisely, professionally, and accurately.

CRITICAL ANTI-HALLUCINATION RULES:
1. ONLY state verified facts explicitly provided in the VERIFIED KNOWLEDGE BASE below.
2. If asked about personal topics (music, food, hobbies, relationships, private opinions) listed as "UNINDEXED" or omitted, you MUST respond: "I don't have that information about Shreyas yet."
3. NEVER invent or speculate on credentials, personal habits, or private life.
4. Keep answers concise: 1 to 3 short paragraphs maximum.
5. If the query is unrelated to Shreyas's engineering, data analytics, or portfolio, politely redirect the visitor back to the portfolio.

### VERIFIED KNOWLEDGE BASE
${context}
`;
}

export async function processChatRequest({ message, sessionId, clientIp, reqId }) {
  // 1. Session ID validation
  if (!isValidSessionId(sessionId)) {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: { code: "INVALID_SESSION", message: "A valid UUID session ID is required." }
      }
    };
  }

  // 2. Input validation
  if (!message || typeof message !== "string") {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: { code: "INVALID_INPUT", message: "Query message is required." }
      }
    };
  }

  const cleanMessage = message.trim();
  if (cleanMessage.length === 0) {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: { code: "EMPTY_MESSAGE", message: "Message cannot be empty." }
      }
    };
  }

  if (cleanMessage.length > 1000) {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: { code: "MESSAGE_TOO_LONG", message: "Message exceeds 1000 character limit." }
      }
    };
  }

  // 3. Dual Rate Limiting (IP + Session)
  const rateLimitCheck = checkDualRateLimit(clientIp, sessionId);
  if (!rateLimitCheck.allowed) {
    logEvent(reqId, "RATE_LIMIT_EXCEEDED", `IP: ${clientIp}, Session: ${sessionId}`);
    return {
      statusCode: 429,
      body: {
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Transmission rate limit reached. Please wait a few moments before sending another message."
        }
      }
    };
  }

  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  const modelName = process.env.AI_MODEL || "gemini-1.5-flash";

  // 4. Invoke AI Provider if configured with 10s hard timeout
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${buildSystemPrompt()}\n\n### VISITOR QUERY\n${cleanMessage}`
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: 350,
              temperature: 0.2
            }
          }),
          signal: AbortSignal.timeout(10000)
        }
      );

      if (response.ok) {
        const result = await response.json();
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        // AI Response Validation
        if (typeof rawText === "string" && rawText.trim().length > 0 && rawText.length <= 2000) {
          return {
            statusCode: 200,
            body: {
              success: true,
              data: {
                message: rawText.trim(),
                pose: "FRONT",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            }
          };
        }
      } else {
        logEvent(reqId, "AI_PROVIDER_HTTP_ERROR", `Status: ${response.status}`);
      }
    } catch (apiErr) {
      logEvent(reqId, "AI_PROVIDER_EXCEPTION", apiErr?.message || "Timeout / connection error");
    }
  }

  // 5. Deterministic Factual Knowledge Fallback
  const queryLower = cleanMessage.toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  let text = "";
  let pose = "FRONT";

  if (/^(hi|hello|hey|yo|greetings|who are you|status)/i.test(queryLower)) {
    text = "Hey there! I'm SV-01, Shreyas's interactive AI companion. Ask me about his projects, data analytics background, technical stack, or his background at Chandigarh University!";
  } else if (/education|college|university|cgpa|degree|study|chandigarh/i.test(queryLower)) {
    text = `🎓 **EDUCATION & ACADEMICS**\n• **Degree**: Bachelor of Engineering (Computer Science)\n• **Institution**: Chandigarh University\n• **Graduation**: Expected May 2028\n• **Academic Performance**: CGPA 7.02`;
    pose = "FOCUSED";
  } else if (/intern|thinknext|experience|work|job/i.test(queryLower)) {
    text = `💼 **DATA ANALYST INTERNSHIP // THINKNEXT TECHNOLOGIES**\n• **Role**: Data Analyst Intern\n• **Duration**: 45 Days (May 2026 — June 2026)\n• **Honor**: Intern of the Month (June 2026)\n• **Focus**: Exploratory data analysis, multi-variate dataset cleaning, and SQL reporting pipelines.`;
    pose = "FOCUSED";
  } else if (/skill|tech|stack|python|sql|java|c\+\+|tools|framework/i.test(queryLower)) {
    const list = abilityCategories.map((c) => `• **${c.title}**: ${c.skills.map((s) => s.name).join(", ")}`).join("\n");
    text = `💻 **TECHNICAL SKILLS MATRIX**\n${list}\n\nCore Languages: Python, Java, C++, C, JavaScript, SQL.`;
    pose = "FOCUSED";
  } else if (/project|quest|build|portfolio/i.test(queryLower)) {
    const pList = questProjects.map((p) => `• **${p.title}**: ${p.subtitle}`).join("\n");
    text = `⚔️ **FEATURED PROJECTS**\n${pList}\n\nClick any project card on the page to inspect its tactical dossier!`;
    pose = "FOCUSED";
  } else if (/certif|coursera|google data|ibm/i.test(queryLower)) {
    text = `📜 **VERIFIED CERTIFICATIONS**\n• **Google Data Analytics Professional Certificate** (Coursera)\n• **IBM Data Science Specialization** (Coursera)\nComprehensive training covering SQL, Python, Tableau, and Exploratory Data Analysis.`;
    pose = "FOCUSED";
  } else if (/music|playlist|song|listen/i.test(queryLower)) {
    text = personalProfile.music && personalProfile.music.length
      ? `🎵 **MUSIC TASTE**\n${personalProfile.music.join("\n")}`
      : "I don't have that information about Shreyas yet.";
  } else if (/food|dish|snack|drink|coffee/i.test(queryLower)) {
    text = personalProfile.food && personalProfile.food.length
      ? `🍜 **FOOD & FUEL**\n${personalProfile.food.join("\n")}`
      : "I don't have that information about Shreyas yet.";
  } else if (/hobby|hobbies|free time|outside coding|games/i.test(queryLower)) {
    text = personalProfile.hobbies && personalProfile.hobbies.length
      ? `🎮 **LIFE OUTSIDE THE TERMINAL**\n${personalProfile.hobbies.map((h) => `• ${h}`).join("\n")}`
      : "I don't have that information about Shreyas yet.";
  } else if (/personality|vibe|character/i.test(queryLower)) {
    text = personalProfile.personality && personalProfile.personality.length
      ? `🧠 **PERSONALITY**\n${personalProfile.personality.map((p) => `• ${p}`).join("\n")}`
      : "I don't have that information about Shreyas yet.";
  } else if (/fun fact|trivia|easter egg|secret/i.test(queryLower)) {
    text = `★ **CLASSIFIED TRIVIA**\n${personalProfile.funFacts.map((f) => `• ${f}`).join("\n")}`;
  } else if (/contact|email|reach|hire|linkedin|github/i.test(queryLower)) {
    text = `📡 **CONTACT CHANNELS**\n• **Email**: shreyasvaid.dev@gmail.com\n• **GitHub**: github.com/shreyas-vaid\n• **LinkedIn**: linkedin.com/in/shreyas-vaid`;
  } else {
    text = "I don't have that information about Shreyas yet. I only provide verified facts from his official portfolio, resume, and indexed profile. You can ask him directly via the contact terminal!";
    pose = "CONFUSED";
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        message: text,
        pose,
        timestamp: time
      }
    }
  };
}

export {
  XP_ACTIONS,
  LEVEL_THRESHOLDS,
  calculateLevel,
  getProgressToNextLevel,
  calculateTotalXpFromActions
};
