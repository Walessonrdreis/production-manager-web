import { Router } from 'express';
import { PlanningController } from './controllers/PlanningController.js';

export const planningRouter = Router();

planningRouter.get('/', PlanningController.getPlanning);
planningRouter.post('/', PlanningController.savePlanning);
planningRouter.put('/:id', PlanningController.updatePlanning);
planningRouter.delete('/:id', PlanningController.deletePlanning);
