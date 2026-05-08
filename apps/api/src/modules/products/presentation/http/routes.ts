import { Router } from 'express';
import { ProductsController } from './controllers/ProductsController.js';
import { validateRequest } from '../../../../shared/http/validate.js';
import { SyncProductsSchema } from './schemas.js';

export const productsRouter = Router();

productsRouter.post('/sync', validateRequest(SyncProductsSchema), ProductsController.sync);
