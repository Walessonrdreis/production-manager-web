import { Router } from 'express';
import { ClientsController } from './controllers/ClientsController.js';
import { validateRequest } from '../../../../shared/http/validate.js';
import { SyncClientsSchema } from './schemas.js';

export const clientsRouter = Router();

clientsRouter.post('/sync', validateRequest(SyncClientsSchema), ClientsController.sync);
clientsRouter.get('/', ClientsController.getClientsList);
clientsRouter.get('/:id', ClientsController.getClientById);
clientsRouter.post('/', ClientsController.createClient);
clientsRouter.put('/:id', ClientsController.updateClient);
clientsRouter.delete('/:id', ClientsController.deleteClient);
