/**
 * Comprehensive Backend Hardening Verification Test Suite
 * Tests all endpoints, session UUID validation, XP anti-cheat,
 * dual rate limiting, Content-Type & 32KB body caps, security headers, and AI fallback.
 */

import http from "node:http";
import { server } from "../../server.js";
import { XP_ACTIONS, calculateLevel, calculateTotalXpFromActions } from "../../src/data/xpConfig.js";

const TEST_PORT = 4199;
const VALID_UUID = "12345678-1234-4234-8234-123456789abc";
const VALID_UUID_2 = "98765432-4321-4321-8321-cba987654321";

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING PORTFOLIO BACKEND HARDENING TEST SUITE");
  console.log("==================================================");

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const baseUrl = `http://localhost:${TEST_PORT}`;

  async function request(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const req = http.request(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        });
      });
      req.on("error", reject);
      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }

  let passedCount = 0;
  function assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion Failed: ${message}`);
    }
    passedCount++;
  }

  try {
    // ----------------------------------------------------
    // TEST GROUP 1: Health & Standard Endpoints
    // ----------------------------------------------------
    console.log("[1/7] Testing Health, Profile, Projects, Experience endpoints...");
    const health = await request("/api/health");
    assert(health.statusCode === 200, "Health status 200");
    assert(health.body.success === true, "Health success true");
    assert(health.body.service === "shreyas-portfolio-api", "Health service name matches");
    assert(health.headers["x-content-type-options"] === "nosniff", "nosniff header present");
    assert(health.headers["content-security-policy"]?.includes("default-src 'self'"), "CSP header present");
    assert(Boolean(health.headers["x-request-id"]), "X-Request-ID present on response");

    const profile = await request("/api/profile");
    assert(profile.statusCode === 200, "Profile status 200");
    assert(profile.headers["cache-control"]?.includes("max-age=300"), "Profile cache headers present");
    assert(profile.body.data.name === "SHREYAS VAID", "Profile name matches verified data");
    assert(profile.body.data.identityDetails.education.institution === "Chandigarh University", "Education verified");

    const projects = await request("/api/projects");
    assert(projects.statusCode === 200, "Projects status 200");
    assert(Array.isArray(projects.body.data) && projects.body.data.length > 0, "Projects array valid");

    const exp = await request("/api/experience");
    assert(exp.statusCode === 200, "Experience status 200");
    assert(exp.body.data.some((m) => m.organization === "ThinkNEXT Technologies"), "Experience verified");

    // Method Not Allowed check
    const badMethod = await request("/api/health", { method: "POST" });
    assert(badMethod.statusCode === 405, "POST /api/health rejected with 405");
    assert(badMethod.headers.allow === "GET", "Allow header specified on 405");
    console.log("  ✓ Health, Profile, Projects, Experience verified");

    // ----------------------------------------------------
    // TEST GROUP 2: Session UUID Validation
    // ----------------------------------------------------
    console.log("[2/7] Testing Session UUID Validation...");
    const validSessionRes = await request(`/api/game/state?sessionId=${VALID_UUID}`);
    assert(validSessionRes.statusCode === 200, "Valid UUID accepted");
    assert(validSessionRes.body.data.sessionId === VALID_UUID, "Session matches");

    const invalidUuid = await request("/api/game/state?sessionId=not-a-uuid");
    assert(invalidUuid.statusCode === 400, "Non-UUID session rejected with 400");
    assert(invalidUuid.body.error.code === "INVALID_SESSION", "Error code INVALID_SESSION");

    const longUuid = await request(`/api/game/state?sessionId=${"a".repeat(150)}`);
    assert(longUuid.statusCode === 400, "Long session ID rejected with 400");

    const emptyUuid = await request("/api/game/state?sessionId=");
    assert(emptyUuid.statusCode === 400, "Missing session ID rejected with 400");
    console.log("  ✓ Session UUID validation verified");

    // ----------------------------------------------------
    // TEST GROUP 3: Canonical XP & Anti-Cheat
    // ----------------------------------------------------
    console.log("[3/7] Testing Canonical XP Rewards and Anti-Cheat...");
    // 1st action: open-terminal -> awards 20
    const prog1 = await request("/api/game/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID, action: "open-terminal" })
    });
    assert(prog1.statusCode === 200, "Progress status 200");
    assert(prog1.body.data.awarded === 20, "open-terminal awards 20 XP");
    assert(prog1.body.data.currentXp === 20, "Total XP is 20");
    assert(prog1.body.data.level === 1, "Level is 1");

    // Duplicate action: open-terminal again -> awards 0
    const prog2 = await request("/api/game/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID, action: "open-terminal" })
    });
    assert(prog2.statusCode === 200, "Duplicate progress status 200");
    assert(prog2.body.data.awarded === 0, "Duplicate awarded is 0");
    assert(prog2.body.data.reason === "already_completed", "Reason already_completed");
    assert(prog2.body.data.currentXp === 20, "XP not modified on duplicate");

    // Anti-cheat: client attempts to send arbitrary XP / amount payload
    const cheatAttempt = await request("/api/game/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: VALID_UUID,
        action: "open-radio",
        xp: 999999,
        amount: 999999,
        level: 99
      })
    });
    assert(cheatAttempt.statusCode === 200, "Valid action processed");
    assert(cheatAttempt.body.data.awarded === 10, "open-radio awards strictly 10 XP, client fake XP ignored");
    assert(cheatAttempt.body.data.currentXp === 30, "Total XP strictly 30 (20 + 10)");
    assert(cheatAttempt.body.data.level === 1, "Level calculated authoritatively");

    // Unknown action rejection
    const badAction = await request("/api/game/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID, action: "item-item-fake-cheat" })
    });
    assert(badAction.statusCode === 400, "Unknown action rejected with 400");
    assert(badAction.body.error.code === "INVALID_ACTION", "Error code INVALID_ACTION");

    // Independent session tracking check
    const progOther = await request("/api/game/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID_2, action: "open-terminal" })
    });
    assert(progOther.statusCode === 200, "Other session processed independently");
    assert(progOther.body.data.awarded === 20, "Other session gets full reward independently");
    console.log("  ✓ Canonical XP and anti-cheat verified");

    // ----------------------------------------------------
    // TEST GROUP 4: Level Calculation Unit Checks
    // ----------------------------------------------------
    console.log("[4/7] Testing Deterministic Level Engine...");
    assert(calculateLevel(0) === 1, "Level at 0 XP is 1");
    assert(calculateLevel(99) === 1, "Level at 99 XP is 1");
    assert(calculateLevel(100) === 2, "Level at 100 XP is 2");
    assert(calculateLevel(250) === 3, "Level at 250 XP is 3");
    assert(calculateLevel(500) === 4, "Level at 500 XP is 4");
    assert(calculateLevel(1300) === 6, "Level at 1300 XP is 6");
    assert(calculateLevel(4100) === 10, "Level at 4100 XP is 10");

    const totalCalculated = calculateTotalXpFromActions({
      "open-terminal": "2026-09-11",
      "open-radio": "2026-09-11",
      "invalid-action-hacker": "2026-09-11"
    });
    assert(totalCalculated === 30, "Invalid actions ignored in total calculation");
    console.log("  ✓ Deterministic level engine verified");

    // ----------------------------------------------------
    // TEST GROUP 5: Request Body Limits (32 KB) & Content-Type
    // ----------------------------------------------------
    console.log("[5/7] Testing Request Body Limits (32 KB) & Content-Type...");
    // Reject non-JSON Content-Type
    const badContentType = await request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "Hello"
    });
    assert(badContentType.statusCode === 415, "Non-JSON rejected with 415");
    assert(badContentType.body.error.code === "INVALID_CONTENT_TYPE", "Error code INVALID_CONTENT_TYPE");

    // Reject oversized body (>32 KB)
    const oversizedBody = JSON.stringify({
      sessionId: VALID_UUID,
      message: "X".repeat(34 * 1024)
    });
    const tooLarge = await request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: oversizedBody
    });
    assert(tooLarge.statusCode === 413, "Oversized payload rejected with 413");
    assert(tooLarge.body.error.code === "PAYLOAD_TOO_LARGE", "Error code PAYLOAD_TOO_LARGE");

    // Reject malformed JSON
    const malformed = await request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ message: missing-quotes"
    });
    assert(malformed.statusCode === 400, "Malformed JSON rejected with 400");
    assert(malformed.body.error.code === "INVALID_JSON", "Error code INVALID_JSON");
    console.log("  ✓ Body limits and Content-Type verified");

    // ----------------------------------------------------
    // TEST GROUP 6: AI Chatbot, Anti-Hallucination & Rate Limiting
    // ----------------------------------------------------
    console.log("[6/7] Testing Chibi AI Chatbot & Anti-Hallucination...");
    // Factual query
    const chatFactual = await request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID, message: "Tell me about Shreyas's university" })
    });
    assert(chatFactual.statusCode === 200, "Chat status 200");
    assert(chatFactual.body.data.message.includes("Chandigarh University"), "Responds with Chandigarh University");

    // Anti-hallucination for unindexed personal detail
    const chatUnindexed = await request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID, message: "What is his favorite video game?" })
    });
    assert(chatUnindexed.statusCode === 200, "Chat status 200");
    assert(chatUnindexed.body.data.message.includes("I don't have that information about Shreyas yet"), "Anti-hallucination fired");

    // Empty message
    const emptyChat = await request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID, message: "   " })
    });
    assert(emptyChat.statusCode === 400, "Empty message rejected with 400");

    // >1000 chars message
    const longChat = await request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: VALID_UUID, message: "W".repeat(1005) })
    });
    assert(longChat.statusCode === 400, "Message >1000 chars rejected with 400");

    // Dual Rate Limiting (trigger on session)
    console.log("  Testing Dual Rate Limiter...");
    const spamSession = "11111111-2222-4333-8444-555555555555";
    let triggeredRateLimit = false;
    for (let i = 0; i < 24; i++) {
      const r = await request("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: spamSession, message: `Ping ${i}` })
      });
      if (r.statusCode === 429) {
        triggeredRateLimit = true;
        assert(r.body.error.code === "RATE_LIMIT_EXCEEDED", "Rate limit error code matches");
        break;
      }
    }
    assert(triggeredRateLimit, "Rate limiting successfully caught excessive queries");
    console.log("  ✓ Chatbot, anti-hallucination, and dual rate limiting verified");

    // ----------------------------------------------------
    // TEST GROUP 7: Security Headers & Unknown Route Handling
    // ----------------------------------------------------
    console.log("[7/7] Testing Security Headers and 404 Route Handling...");
    const notFound = await request("/api/non-existent-endpoint");
    assert(notFound.statusCode === 404, "Unknown endpoint returns 404");
    assert(notFound.body.error.code === "NOT_FOUND", "Error code NOT_FOUND");
    assert(notFound.headers["x-content-type-options"] === "nosniff", "nosniff on 404");
    assert(Boolean(notFound.headers["x-request-id"]), "Request ID on 404");

    console.log("==================================================");
    console.log(`ALL TESTS PASSED! (${passedCount} assertions verified)`);
    console.log("==================================================");
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
