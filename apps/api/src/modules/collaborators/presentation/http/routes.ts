import { Router } from 'express';
import { CollaboratorsController } from './controllers/CollaboratorsController.js';

export const collaboratorsRouter = Router();

collaboratorsRouter.get('/', CollaboratorsController.list);
collaboratorsRouter.post('/', CollaboratorsController.create);
collaboratorsRouter.put('/:id', CollaboratorsController.update);
collaboratorsRouter.delete('/:id', CollaboratorsController.delete);
