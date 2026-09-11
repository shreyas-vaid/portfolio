import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import healthHandler from './api/health.js'
import profileHandler from './api/profile.js'
import projectsHandler from './api/projects.js'
import experienceHandler from './api/experience.js'
import gameStateHandler from './api/game/state.js'
import gameProgressHandler from './api/game/progress.js'
import chatHandler from './api/chat.js'
import { sendJsonResponse } from './server/lib/portfolioBackend.js'

function portfolioApiDevPlugin() {
  return {
    name: 'portfolio-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }
        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        try {
          if (pathname === '/api/health') return healthHandler(req, res);
          if (pathname === '/api/profile') return profileHandler(req, res);
          if (pathname === '/api/projects') return projectsHandler(req, res);
          if (pathname === '/api/experience') return experienceHandler(req, res);
          if (pathname === '/api/game/state') return gameStateHandler(req, res);
          if (pathname === '/api/game/progress') return await gameProgressHandler(req, res);
          if (pathname === '/api/chat') return await chatHandler(req, res);

          return sendJsonResponse(res, 404, {
            success: false,
            error: { code: 'NOT_FOUND', message: `Endpoint '${pathname}' does not exist.` }
          });
        } catch (err) {
          console.error('[API Dev Server Error]:', err);
          next(err);
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), portfolioApiDevPlugin()],
})
