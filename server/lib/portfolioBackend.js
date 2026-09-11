/**
 * Core Portfolio Backend Engine
 * Canonical data providers, security utilities, rate limiting,
 * deterministic XP engine, and Chibi AI companion service.
 */

import { profileData } from "../../src/data/profile.js";
import { personalProfile } from "../../src/data/personalProfile.js";
import { questProjects } from "../../src/data/projects.js";
import { missionHistory } from "../../src/data/experience.js";
import { abilityCategories } from "../../src/data/skills.js";

// ==========================================
// 1. SECURITY & HEADERS
// ==========================================

export function applySecurityHeaders(res) {
  if (!res || !res.setHeader) return;
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

export function sendJsonResponse(res, statusCode, data) {
  applySecurityHeaders(res);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export async function parseRequestBody(req) {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 500000) {
        req.destroy();
        resolve(null);
      }
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

// ==========================================
// 2. IN-MEMORY RATE LIMITING
// ==========================================

const rateLimitBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 20;

export function checkRateLimit(identifier) {
  const key = identifier || "anonymous";
  const now = Date.now();
  let bucket = rateLimitBuckets.get(key);

  if (!bucket || now - bucket.startTime > RATE_LIMIT_WINDOW_MS) {
    bucket = { startTime: now, count: 1 };
    rateLimitBuckets.set(key, bucket);
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - bucket.count };
}

// Periodic cleanup of stale rate-limit buckets (every 15 min)
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateLimitBuckets.entries()) {
      if (now - bucket.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitBuckets.delete(key);
      }
    }
  }, 15 * 60 * 1000);
  if (cleanupTimer && cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

// ==========================================
// 3. DETERMINISTIC XP & LEVEL CONFIGURATION
// ==========================================

export const XP_REWARDS = {
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
};

export const LEVEL_THRESHOLDS = [
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
];

export function calculateLevelFromXp(xp = 0) {
  const safeXp = Math.max(0, Number(xp) || 0);
  let currentLevel = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (safeXp >= LEVEL_THRESHOLDS[i].minXp) {
      currentLevel = LEVEL_THRESHOLDS[i].level;
      break;
    }
  }
  return currentLevel;
}

export function getProgressToNextLevel(xp = 0) {
  const safeXp = Math.max(0, Number(xp) || 0);
  const currentLevel = calculateLevelFromXp(safeXp);
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

// In-memory anonymous session game state
const serverGameSessions = new Map();

export function getServerGameState(sessionId) {
  if (!sessionId || typeof sessionId !== "string") {
    return {
      version: 2,
      xp: 0,
      level: 1,
      completedActions: {}
    };
  }

  if (!serverGameSessions.has(sessionId)) {
    serverGameSessions.set(sessionId, {
      sessionId,
      version: 2,
      xp: 0,
      level: 1,
      completedActions: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return serverGameSessions.get(sessionId);
}

export function recordGameProgress(sessionId, action) {
  if (!sessionId || typeof sessionId !== "string" || sessionId.length > 128) {
    return {
      success: false,
      error: { code: "INVALID_SESSION", message: "A valid anonymous session ID is required." }
    };
  }

  if (!action || typeof action !== "string" || !(action in XP_REWARDS)) {
    return {
      success: false,
      error: { code: "INVALID_ACTION", message: `Action '${action}' is not recognized.` }
    };
  }

  const session = getServerGameState(sessionId);

  // Check action deduplication
  if (session.completedActions[action]) {
    return {
      success: true,
      data: {
        awarded: 0,
        reason: "already_completed",
        currentXp: session.xp,
        level: session.level,
        completedActions: session.completedActions
      }
    };
  }

  // Award reward deterministically
  const award = XP_REWARDS[action];
  session.completedActions[action] = new Date().toISOString();
  session.xp += award;
  session.level = calculateLevelFromXp(session.xp);
  session.updatedAt = new Date().toISOString();

  return {
    success: true,
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
// 4. CANONICAL PORTFOLIO DATA CONTROLLERS
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
// 5. CHIBI COMPANION AI BACKEND
// ==========================================

function buildSystemPrompt() {
  return `You are SV-01, the interactive tactical digital companion for Shreyas Vaid's developer portfolio.
Your role: Answer visitor queries concisely, professionally, and warmly.

STRICT KNOWLEDGE AND FACTUALITY RULES:
1. Shreyas Vaid is an Undergraduate Computer Science Engineering student at Chandigarh University (Expected May 2028, CGPA 7.02).
2. Professional Experience:
   - Data Analyst Intern at ThinkNEXT Technologies (Mohali, India, May 2026 – June 2026, 45 days).
   - Awarded "Intern of the Month" at ThinkNEXT Technologies (June 2026).
3. Technical Skills:
   - Languages: Python, Java, C++, C, JavaScript, SQL.
   - Frameworks & Analytics: Flask, Streamlit, Pandas, NumPy, React, Vite.
   - Tools & Systems: Git, GitHub, VS Code, Linux / Ubuntu, Vercel.
   - Core CS: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks.
4. Certifications:
   - Google Data Analytics Professional Certificate (Coursera).
   - IBM Data Science Specialization (Coursera).
5. Personal Profile:
   - Music: ${JSON.stringify(personalProfile.music)}
   - Favorite foods & beverages: ${JSON.stringify(personalProfile.food)}
   - Hobbies: ${JSON.stringify(personalProfile.hobbies)}
   - Personality: ${JSON.stringify(personalProfile.personality)}
   - Fun Facts: ${JSON.stringify(personalProfile.funFacts)}
   - Goals: ${JSON.stringify(personalProfile.goals)}
   - Life outside coding: ${JSON.stringify(personalProfile.lifeOutsideCoding)}

CRITICAL ANTI-HALLUCINATION INSTRUCTIONS:
- ONLY state facts listed above.
- If asked about personal topics not explicitly documented above (e.g. unlisted food, relationships, unlisted hobbies, private opinions), you MUST respond naturally: "I don't have that information about Shreyas yet."
- NEVER invent or speculate on personal habits, qualifications, or credentials.
- If asked unrelated general knowledge questions, politely redirect the visitor toward Shreyas's portfolio and projects.
- Keep your answers concise: 1 to 3 short paragraphs maximum.`;
}

export async function processChatRequest({ message, sessionId, clientIp }) {
  // Input Validation
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

  // Rate Limiting
  const rateLimitId = sessionId || clientIp || "global";
  const limitCheck = checkRateLimit(rateLimitId);
  if (!limitCheck.allowed) {
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

  // If AI API key is configured, invoke AI provider
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
                  { text: `${buildSystemPrompt()}\n\nVisitor Query: ${cleanMessage}` }
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
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            statusCode: 200,
            body: {
              success: true,
              data: {
                message: text.trim(),
                pose: "FRONT",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
            }
          };
        }
      }
    } catch (apiErr) {
      console.error("[SV-01 Chat Service Error]:", apiErr?.message || "Provider call failed");
      // Fall through to deterministic verified knowledge engine
    }
  }

  // Factual deterministic fallback engine (strict anti-hallucination)
  const queryLower = cleanMessage.toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let text = "";
  let pose = "FRONT";

  if (/^(hi|hello|hey|yo|greetings|who are you|status)/i.test(queryLower)) {
    text = "Hey there! I'm SV-01, Shreyas's interactive AI companion. Ask me about his projects, data analytics background, technical stack, or his background at Chandigarh University!";
  } else if (/education|college|university|cgpa|degree|study|chandigarh/i.test(queryLower)) {
    text = `🎓 **EDUCATION & ACADEMICS**\n• **Degree**: Bachelor of Engineering in Computer Science Engineering\n• **Institution**: Chandigarh University\n• **Graduation**: Expected May 2028\n• **Academic Performance**: CGPA 7.02`;
    pose = "FOCUSED";
  } else if (/intern|thinknext|experience|work|job/i.test(queryLower)) {
    text = `💼 **DATA ANALYST INTERNSHIP // THINKNEXT TECHNOLOGIES**\n• **Role**: Data Analyst Intern\n• **Duration**: 45 Days (May 2026 — June 2026)\n• **Honor**: Intern of the Month (June 2026)\n• **Focus**: Exploratory data analysis, multi-variate dataset cleaning, and SQL reporting pipelines.`;
    pose = "FOCUSED";
  } else if (/skill|tech|stack|python|sql|java|c\+\+|tools|framework/i.test(queryLower)) {
    const list = abilityCategories.map(c => `• **${c.title}**: ${c.skills.map(s => s.name).join(", ")}`).join("\n");
    text = `💻 **TECHNICAL SKILLS MATRIX**\n${list}\n\nCore Languages: Python, Java, C++, C, JavaScript, SQL.`;
    pose = "FOCUSED";
  } else if (/project|quest|build|portfolio/i.test(queryLower)) {
    const pList = questProjects.map(p => `• **${p.title}**: ${p.subtitle}`).join("\n");
    text = `⚔️ **FEATURED PROJECTS**\n${pList}\n\nClick any project card on the page to inspect its tactical dossier!`;
    pose = "FOCUSED";
  } else if (/certif|coursera|google data|ibm/i.test(queryLower)) {
    text = `📜 **VERIFIED CERTIFICATIONS**\n• **Google Data Analytics Professional Certificate** (Coursera)\n• **IBM Data Science Specialization** (Coursera)\nComprehensive training covering SQL, Python, Tableau, and Exploratory Data Analysis.`;
    pose = "FOCUSED";
  } else if (/music|playlist|song|listen/i.test(queryLower)) {
    text = `🎵 **MUSIC TASTE**\n${personalProfile.music.join("\n")}`;
  } else if (/food|dish|snack|drink|coffee/i.test(queryLower)) {
    text = `🍜 **FOOD & FUEL**\n${personalProfile.food.join("\n")}`;
  } else if (/hobby|hobbies|free time|outside coding|games/i.test(queryLower)) {
    text = `🎮 **LIFE OUTSIDE THE TERMINAL**\n${personalProfile.hobbies.map(h => `• ${h}`).join("\n")}`;
  } else if (/fun fact|trivia|easter egg|secret/i.test(queryLower)) {
    text = `★ **CLASSIFIED TRIVIA**\n${personalProfile.funFacts.map(f => `• ${f}`).join("\n")}`;
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
