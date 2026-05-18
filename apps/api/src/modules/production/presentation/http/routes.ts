import { Router } from 'express';
import { ProductionController } from './controllers/ProductionController.js';

export const productionRouter = Router();

productionRouter.get('/produced', ProductionController.getProduced);
productionRouter.get('/produced/:id', ProductionController.getProducedById);
productionRouter.post('/produced', ProductionController.saveProduced);
productionRouter.put('/produced/:id', ProductionController.updateProducedSync);
productionRouter.delete('/produced/:id', ProductionController.deleteProduced);

productionRouter.get('/schedules', ProductionController.getSchedules);
productionRouter.get('/schedules/:id', ProductionController.getScheduleById);
productionRouter.post('/schedules', ProductionController.saveSchedule);
productionRouter.delete('/schedules/:id', ProductionController.deleteSchedule);
