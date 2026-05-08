import { Router } from 'express';
import { ClientsController } from './controllers/ClientsController.js';

export const clientsRouter = Router();

clientsRouter.post('/sync', ClientsController.sync);
