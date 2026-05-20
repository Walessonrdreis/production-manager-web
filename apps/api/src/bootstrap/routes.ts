import { Router } from 'express';
import { proxyRouter } from '../modules/proxy/presentation/http/routes.js';
import { catalogRouter } from '../modules/catalog/presentation/http/routes.js';
import { stocksRouter } from '../modules/stocks/presentation/http/routes.js';
import { ordersRouter } from '../modules/orders/presentation/http/routes.js';
import { clientsRouter } from '../modules/clients/presentation/http/routes.js';
import { productionControlRouter } from '../modules/production-control/presentation/http/routes.js';
import { sectorsRouter } from '../modules/sectors/presentation/http/routes.js';
import { planningRouter } from '../modules/planning/presentation/http/routes.js';
import { goalsRouter } from '../modules/goals/presentation/http/routes.js';
import { productionRouter } from '../modules/production/presentation/http/routes.js';
import { authRouter } from '../modules/auth/presentation/http/routes.js';
import { collaboratorsRouter } from '../modules/collaborators/presentation/http/routes.js';
import { productionOrdersRouter } from '../modules/production-orders/presentation/http/routes.js';
import { trelloRoutes } from '../modules/trello/presentation/http/routes.js';

export function buildApiRouter(): Router {
  const router = Router();

  // Rotas de domínios específicos
  router.use('/catalog', catalogRouter);
  router.use('/stocks', stocksRouter);
  router.use('/orders', ordersRouter);
  router.use('/clients', clientsRouter);
  router.use('/production-control', productionControlRouter);
  router.use('/sectors', sectorsRouter);
  router.use('/planning', planningRouter);
  router.use('/goals', goalsRouter);
  router.use('/production', productionRouter);
  router.use('/auth', authRouter);
  router.use('/collaborators', collaboratorsRouter);
  router.use('/production-orders', productionOrdersRouter);
  router.use('/trello', trelloRoutes);

  // Rotas do módulo proxy
  router.use('/proxy', proxyRouter);

  return router;
}
