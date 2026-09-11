/**
 * Portfolio Backend Server
 * Production-ready, zero-dependency Node HTTP server.
 * Handles API routes: /api/health, /api/profile, /api/projects, /api/experience, /api/game/state, /api/game/progress, /api/chat.
 */

import http from "node:http";
import healthHandler from "./api/health.js";
import profileHandler from "./api/profile.js";
import projectsHandler from "./api/projects.js";
import experienceHandler from "./api/experience.js";
import gameStateHandler from "./api/game/state.js";
import gameProgressHandler from "./api/game/progress.js";
import chatHandler from "./api/chat.js";
import { applySecurityHeaders, sendJsonResponse } from "./server/lib/portfolioBackend.js";

const PORT = process.env.PORT || 3000;

export const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Route Dispatcher
  try {
    if (pathname === "/api/health") {
      return healthHandler(req, res);
    }
    if (pathname === "/api/profile") {
      return profileHandler(req, res);
    }
    if (pathname === "/api/projects") {
      return projectsHandler(req, res);
    }
    if (pathname === "/api/experience") {
      return experienceHandler(req, res);
    }
    if (pathname === "/api/game/state") {
      return gameStateHandler(req, res);
    }
    if (pathname === "/api/game/progress") {
      return await gameProgressHandler(req, res);
    }
    if (pathname === "/api/chat") {
      return await chatHandler(req, res);
    }

    // 404 Not Found for unmatched routes
    return sendJsonResponse(res, 404, {
      success: false,
      error: { code: "NOT_FOUND", message: `Endpoint '${pathname}' does not exist.` }
    });
  } catch (err) {
    console.error(`[Server Error on ${pathname}]:`, err?.message || err);
    return sendJsonResponse(res, 500, {
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." }
    });
  }
});

// Start Server if directly executed
if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  server.listen(PORT, () => {
    console.log(`[SV Portfolio API] Server running on http://localhost:${PORT}`);
  });

  // Graceful Shutdown
  const shutdown = (signal) => {
    console.log(`[SV Portfolio API] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("[SV Portfolio API] Server closed.");
      process.exit(0);
    });

    // Force exit if hanging
    setTimeout(() => {
      console.error("[SV Portfolio API] Force exit after timeout.");
      process.exit(1);
    }, 5000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}