import { Router } from 'express';
import { ProductionOrdersController } from './controllers/ProductionOrdersController.js';

export const productionOrdersRouter = Router();

productionOrdersRouter.get('/', ProductionOrdersController.getOrders);
productionOrdersRouter.post('/', ProductionOrdersController.createOrder);
productionOrdersRouter.patch('/:id', ProductionOrdersController.updateOrder);
productionOrdersRouter.delete('/:id', ProductionOrdersController.deleteOrder);
