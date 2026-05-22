import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { configureApp } from './app.js';
import { startBackgroundJobs } from './plugins/jobs.js';
import { validateConnections } from '../infra/prisma.js';

export async function startServer() {
  const app = express();
  const PORT = 3000;

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  // Validate Database Connections (Phase 1 Migration)
  await validateConnections();

  // Configuring core API functionalities, routes, etc.
  configureApp(app);

  // Initialize background jobs (cron)
  startBackgroundJobs();

  // Vite middleware for development (must be AFTER API routes)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: path.join(process.cwd(), 'apps/web'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Explicit fallback for client-side routing in dev
    app.use('*', async (req, res, next) => {
      // Do not intercept API or static asset paths
      if (req.originalUrl.startsWith('/api') || req.originalUrl.includes('.')) {
        return next();
      }

      try {
        const fs = await import('fs');
        const template = fs.readFileSync(path.join(process.cwd(), 'apps/web/index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Proxy targeting: ${process.env.VITE_API_BASE_URL || 'Not specified'}`);
  });
}