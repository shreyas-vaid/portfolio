# Shreyas Vaid — Developer & Analyst Portfolio

> Cyberpunk × JRPG tactical developer portfolio engineered with React, Vite, Framer Motion, and a lightweight, zero-dependency Node / Vercel Serverless backend.

---

## 🏛️ Architecture Overview

The system combines a reactive client-side frontend with an authoritative service layer and lightweight backend API:

```
             ┌──────────────────────────────┐
             │      EXISTING REACT UI       │
             │   (Hero, Quests, HUD, Chibi) │
             └──────────────┬───────────────┘
                            │
                            ▼
             ┌──────────────────────────────┐
             │      API CLIENT SERVICE      │
             │     (src/services/api.js)    │
             └──────────────┬───────────────┘
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
 Game State           Portfolio Data          AI Chat
 Engine (v2)        (Canonical Models)        Endpoint
(localStorage +              │             (POST /api/chat)
 Optional Sync)              │                     │
      │                      │                     ▼
      ▼                      ▼              Rate-Limited AI
 Anonymous Session      Clean REST APIs      (Server-Side API Key
   Persistence         (/api/profile, etc.)   Strict Factuality)
```

---

## 🚀 API Endpoints

All endpoints include security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) and rate limiting where appropriate.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & build version. |
| `GET` | `/api/profile` | Authoritative professional identity and verified attributes. |
| `GET` | `/api/projects` | Quest & project portfolio records. |
| `GET` | `/api/experience`| Verified operational timeline (ThinkNEXT internship, etc.). |
| `GET` | `/api/game/state` | Retrieves server-side game telemetry for an anonymous `sessionId`. |
| `POST` | `/api/game/progress`| Validates actions against anti-cheat rewards table and updates XP/level. |
| `POST` | `/api/chat` | Secure SV-01 companion AI endpoint with strict factual anti-hallucination guards. |

---

## ⚙️ Environment Variables

Copy `.env.example` to create your local environment file:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| :--- | :--- | :--- |
| `AI_API_KEY` | Optional | Google Gemini API key for dynamic AI chat. If omitted, the companion runs on the built-in factual deterministic engine. |
| `AI_MODEL` | Optional | Model identifier (Default: `gemini-1.5-flash`). |
| `PORT` | Optional | Port for the standalone Node server (Default: `3000`). |
| `VITE_API_BASE_URL` | Optional | Base URL for remote API calls; leave empty for same-origin dev and production. |

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run unified development server** (Frontend + API dev middleware):
   ```bash
   npm run dev
   ```
   *Vite serves both the client app and all `/api/*` endpoints directly without needing multiple terminals.*

3. **Run standalone backend server** (Optional):
   ```bash
   npm run start
   ```

4. **Lint and Build**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🎮 Game State & XP Persistence

- **Anonymous by Design**: Progress is tracked using an anonymous session UUID (`crypto.randomUUID()`). No accounts, passwords, or personal identifying information are required.
- **Dual-Layer Resilience**: `localStorage` serves as the primary persistence layer (`shreyas_os_state_v2`). If the server is offline, all unlocks, themes, and achievements continue working seamlessly.
- **Migration Engine**: Automatically migrates legacy `shreyas_os_state_v1` data without wiping user progress.
- **Anti-Farming XP System**: Server-side action reward table (`XP_REWARDS`) prevents duplicate reward farming and ignores arbitrary client XP payloads.
- **Secret Themes**: Unlocks such as the secret `NIGHT // VIOLET` visual protocol are preserved across sessions.

---

## 🤖 Chibi AI Companion (SV-01) Setup

- **Server-Side Security**: AI provider API keys remain strictly server-side.
- **Strict Factuality**: The companion is strictly constrained to verified facts from the resume and `src/data/personalProfile.js`.
- **Anti-Hallucination Guard**: Questions about unindexed personal details safely respond with: *"I don't have that information about Shreyas yet."*
- **Offline Graceful Fallback**: If network is disconnected or API is unreachable, the client falls back to the local knowledge engine without interrupting the browsing experience.

---

## 🌐 Deployment Notes

- **Vercel**: The `/api` directory contains native Vercel serverless functions ready for production edge deployment.
- **Node.js / VPS / Docker**: `server.js` provides a zero-dependency production HTTP server handling routing, security headers, and graceful shutdown (`SIGINT`, `SIGTERM`).
