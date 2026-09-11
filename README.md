# Shreyas Vaid — Developer & Analyst Portfolio

> Cyberpunk × JRPG tactical developer portfolio engineered with React, Vite, Framer Motion, and a hardened, zero-dependency Node / Vercel Serverless backend.

---

## 🏛️ Architecture Overview

The system combines a reactive client-side frontend with an authoritative service layer and hardened backend API:

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
      ▼                      ▼              Dual Rate-Limited
 Anonymous Session      Clean REST APIs         AI Service
   Persistence         (/api/profile, etc.)   (Server-Side Key
(Primary Storage)                            Strict Factuality)
```

> [!NOTE]
> **Persistence Model**: Game progression uses `localStorage` as the primary durable persistence layer (`shreyas_os_state_v2`). Server-side game sessions are in-memory runtime synchronization state, not a permanent database.

---

## 🚀 API Endpoints

All endpoints enforce security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`), request IDs (`X-Request-ID`), strict method validation (`405 Method Not Allowed` with `Allow` header), and dual rate limiting.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Lightweight service health status & version (no-cache). |
| `GET` | `/api/profile` | Authoritative professional identity and verified attributes (cached). |
| `GET` | `/api/projects` | Verified quest & project portfolio records (cached). |
| `GET` | `/api/experience`| Verified operational timeline (ThinkNEXT internship, etc.) (cached). |
| `GET` | `/api/game/state` | Retrieves server runtime session state for an anonymous UUID `sessionId`. |
| `POST` | `/api/game/progress`| Validates actions against canonical `XP_ACTIONS` table and updates XP/level. |
| `POST` | `/api/chat` | Secure SV-01 companion AI endpoint with strict factual anti-hallucination guards. |

---

## 🔒 Security & Hardening Features

1. **Canonical XP Action Registry**: Both client and server consume the single source of truth in `src/data/xpConfig.js`. Clients cannot submit arbitrary amounts or fake actions; all XP is calculated authoritatively.
2. **Session ID Validation**: Strictly validates RFC4122 UUID format. Malformed, long, or non-UUID session IDs are rejected with `400 INVALID_SESSION`.
3. **Dual Rate Limiting**: Enforces rate limiting on both client IP address (30 req / 10 min) and session ID (20 req / 10 min), preventing session-rotation bypass attacks.
4. **32 KB Request Cap & Content-Type Validation**: POST requests strictly require `Content-Type: application/json` and reject payloads larger than 32 KB with `413 PAYLOAD_TOO_LARGE`.
5. **Request IDs & Structured Logs**: Every request is assigned a unique `X-Request-ID` attached to responses and server logs.
6. **Strict Content Security Policy**: Comprehensive CSP compatible with Vite, Google Fonts, Web Audio API, and Gemini API without breaking inline React styles.
7. **Strict Anti-Hallucination AI Prompting**: Dynamically assembled from canonical data files (`src/data/personalProfile.js`, `profile.js`, `skills.js`, etc.). Unindexed personal details strictly trigger: *"I don't have that information about Shreyas yet."*

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
| `ALLOWED_ORIGIN` | Optional | Specific allowed CORS origin for cross-origin production hosting. |

---

## 💻 Local Development & Testing

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run unified development server** (Frontend + API dev middleware):
   ```bash
   npm run dev
   ```

3. **Run standalone backend server** (Optional):
   ```bash
   npm run start
   ```

4. **Run backend test suite**:
   ```bash
   npm test
   ```

5. **Lint and Build**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🎮 Game State & XP Persistence

- **Anonymous by Design**: Progress is tracked using an anonymous session UUID (`crypto.randomUUID()`). No accounts, passwords, or personal identifying information are required.
- **Dual-Layer Resilience**: `localStorage` serves as the primary persistence layer (`shreyas_os_state_v2`). If the server restarts or is offline, all unlocks, themes, and achievements continue working seamlessly.
- **Migration Engine**: Automatically migrates legacy `shreyas_os_state_v1` data without wiping user progress.
- **Anti-Farming XP System**: Server-side action reward table (`XP_ACTIONS`) prevents duplicate reward farming and ignores arbitrary client XP payloads.
- **Secret Themes**: Unlocks such as the secret `NIGHT // VIOLET` visual protocol are preserved across sessions.
