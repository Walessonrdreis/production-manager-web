import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { buildApiRouter } from './routes.js';
import { globalErrorHandler } from './plugins/error-handler.js';

export function configureApp(app: Express) {
  // Security middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Prevents blocking inline scripts in dev/vite
  }));
  app.use(cors());

  // Input parsing
  app.use(express.json());

  // Logging middleware (Rule 16: Observabilidade e Logs)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith('/api')) return next();
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `[INFO] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
      if (res.statusCode >= 500) {
        console.error(logMessage);
      } else if (res.statusCode >= 400) {
        console.warn(logMessage);
      } else {
        console.info(logMessage);
      }
    });
    next();
  });

  // Health check endpoint (Infra improvement)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api', buildApiRouter());

  // Global Error Handler for API endpoints
  app.use('/api', globalErrorHandler);
}
