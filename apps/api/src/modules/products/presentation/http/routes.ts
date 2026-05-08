import { Router } from 'express';
import { ProductsController } from './controllers/ProductsController.js';
import { validateRequest } from '../../../../shared/http/validate.js';
import { SyncProductsSchema } from './schemas.js';

export const productsRouter = Router();

productsRouter.post('/sync', validateRequest(SyncProductsSchema), ProductsController.sync);
productsRouter.get('/', ProductsController.getProductsList);
productsRouter.post('/stock/refresh', ProductsController.refreshStock);
productsRouter.get('/admin', ProductsController.getAdminProducts);
