import { Router } from 'express';
import { ProductsController } from './controllers/ProductsController.js';

export const productsRouter = Router();

productsRouter.post('/sync', ProductsController.sync);
