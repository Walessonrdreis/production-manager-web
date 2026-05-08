import { Router } from 'express';
import { ProductionController } from './controllers/ProductionController.js';

export const productionRouter = Router();

productionRouter.get('/produced', ProductionController.getProduced);
productionRouter.get('/schedules', ProductionController.getSchedules);
