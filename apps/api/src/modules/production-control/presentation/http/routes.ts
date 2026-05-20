import { Router } from 'express';
import { ProductionControlController } from './controllers/ProductionControlController.js';

export const productionControlRouter = Router();

productionControlRouter.get('/stage20/totals', ProductionControlController.getStage20Totals);
