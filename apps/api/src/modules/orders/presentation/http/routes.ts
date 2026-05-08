import { Router } from 'express';
import { OrdersController } from './controllers/OrdersController.js';
import { validateRequest } from '../../../../shared/http/validate.js';
import { SyncOrdersSchema } from './schemas.js';

export const ordersRouter = Router();

ordersRouter.post('/sync', validateRequest(SyncOrdersSchema), OrdersController.sync);
