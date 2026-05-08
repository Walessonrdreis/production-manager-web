import { Router } from 'express';
import { DashboardController } from './controllers/DashboardController.js';

export const dashboardRouter = Router();

dashboardRouter.get('/stage20/totals', DashboardController.getStage20Totals);
dashboardRouter.get('/produced', DashboardController.getProduced);
