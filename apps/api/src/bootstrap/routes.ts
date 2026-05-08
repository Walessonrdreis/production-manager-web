import { Router } from 'express';
import { proxyRouter } from '../modules/proxy/presentation/http/routes.js';

export function buildApiRouter(): Router {
  const router = Router();

  // Rotas do módulo proxy
  router.use('/proxy', proxyRouter);

  return router;
}
