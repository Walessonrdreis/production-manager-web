import { Router } from 'express';
import { proxyRouter } from '../modules/proxy/presentation/http/routes.js';
import { productsRouter } from '../modules/products/presentation/http/routes.js';
import { ordersRouter } from '../modules/orders/presentation/http/routes.js';
import { clientsRouter } from '../modules/clients/presentation/http/routes.js';

export function buildApiRouter(): Router {
  const router = Router();

  // Rotas de domínios específicos
  router.use('/products', productsRouter);
  router.use('/orders', ordersRouter);
  router.use('/clients', clientsRouter);

  // Rotas do módulo proxy
  router.use('/proxy', proxyRouter);

  return router;
}
