import { Router } from 'express';
import { GoalsController } from './controllers/GoalsController.js';

export const goalsRouter = Router();

goalsRouter.get('/', GoalsController.getGoals);
