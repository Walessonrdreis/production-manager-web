import { Router } from 'express';
import { OrdersController } from './controllers/OrdersController.js';

export const ordersRouter = Router();

ordersRouter.post('/sync', OrdersController.sync);
