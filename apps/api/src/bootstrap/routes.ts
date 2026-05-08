import { Router } from 'express';
import { proxyRouter } from '../modules/proxy/presentation/http/routes.js';
import { productsRouter } from '../modules/products/presentation/http/routes.js';
import { ordersRouter } from '../modules/orders/presentation/http/routes.js';
import { clientsRouter } from '../modules/clients/presentation/http/routes.js';
import { dashboardRouter } from '../modules/dashboard/presentation/http/routes.js';
import { sectorsRouter } from '../modules/sectors/presentation/http/routes.js';
import { planningRouter } from '../modules/planning/presentation/http/routes.js';
import { goalsRouter } from '../modules/goals/presentation/http/routes.js';
import { productionRouter } from '../modules/production/presentation/http/routes.js';
import { authRouter } from '../modules/auth/presentation/http/routes.js';

export function buildApiRouter(): Router {
  const router = Router();

  // Rotas de domínios específicos
  router.use('/products', productsRouter);
  router.use('/orders', ordersRouter);
  router.use('/clients', clientsRouter);
  router.use('/dashboard', dashboardRouter);
  router.use('/sectors', sectorsRouter);
  router.use('/planning', planningRouter);
  router.use('/goals', goalsRouter);
  router.use('/production', productionRouter);
  router.use('/auth', authRouter);

  // Rotas do módulo proxy
  router.use('/proxy', proxyRouter);

  return router;
}
