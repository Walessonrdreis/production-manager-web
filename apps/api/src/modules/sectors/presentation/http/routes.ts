import { Router } from 'express';
import { SectorsController } from './controllers/SectorsController.js';

export const sectorsRouter = Router();

sectorsRouter.get('/', SectorsController.getSectors);
sectorsRouter.post('/', SectorsController.createSector);
sectorsRouter.put('/:id', SectorsController.updateSector);
sectorsRouter.delete('/:id', SectorsController.deleteSector);
