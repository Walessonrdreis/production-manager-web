import { Router } from 'express';
import { ProxyController } from './controllers/ProxyController';

const proxyRouter = Router();

// Apenas proxy genérico (fallback)
proxyRouter.use('/', ProxyController.genericProxy);

export { proxyRouter };
