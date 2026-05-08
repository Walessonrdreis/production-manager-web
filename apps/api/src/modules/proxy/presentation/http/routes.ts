import { Router } from 'express';
import { ProxyController } from './controllers/ProxyController';

const proxyRouter = Router();

// Order is important
proxyRouter.post('/admin/omie/sync/products', ProxyController.syncProducts);
proxyRouter.post('/admin/omie/orders/stage20/sync', ProxyController.syncOrders);
proxyRouter.post('/admin/omie/clients/sync', ProxyController.syncClients);
proxyRouter.use('/', ProxyController.genericProxy);

export { proxyRouter };
