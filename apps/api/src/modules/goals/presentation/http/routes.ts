import { Router } from 'express';
import { GoalsController } from './controllers/GoalsController.js';

export const goalsRouter = Router();

goalsRouter.get('/', GoalsController.getGoals);
goalsRouter.get('/:id', GoalsController.getGoalById);
goalsRouter.post('/', GoalsController.createGoal);
goalsRouter.put('/:id', GoalsController.updateGoal);
goalsRouter.delete('/:id', GoalsController.deleteGoal);
