import { Router } from 'express';
import { PlanningController } from './controllers/PlanningController.js';

export const planningRouter = Router();

planningRouter.get('/', PlanningController.getPlanning);
