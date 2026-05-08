import express, { Express } from 'express';
import { buildApiRouter } from './routes.js';
import { globalErrorHandler } from './plugins/error-handler.js';
import { initDb } from '../legacy/db.js';

export function configureApp(app: Express) {
  // Initialize Database
  initDb();

  // Body parser
  app.use(express.json());

  // Use the extracted API modules
  app.use('/api', buildApiRouter());

  // Global Error Handler for API endpoints
  app.use('/api', globalErrorHandler);
}
