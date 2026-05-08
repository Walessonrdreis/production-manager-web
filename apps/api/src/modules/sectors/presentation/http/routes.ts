import { Router } from 'express';
import { SectorsController } from './controllers/SectorsController.js';

export const sectorsRouter = Router();

sectorsRouter.get('/', SectorsController.getSectors);
