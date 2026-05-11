import { Router } from 'express';
import { CatalogController } from './controllers/CatalogController.js';
import { validateRequest } from '../../../../shared/http/validate.js';
import { SyncCatalogSchema } from './schemas.js';

export const catalogRouter = Router();

catalogRouter.post('/sync', validateRequest(SyncCatalogSchema), CatalogController.sync);
catalogRouter.get('/', CatalogController.getCatalogList);
catalogRouter.post('/stock/refresh', CatalogController.refreshStock);
catalogRouter.get('/admin', CatalogController.getAdminProducts);
