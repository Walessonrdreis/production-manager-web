import { Router } from 'express';
import { StocksController } from './controllers/StocksController.js';

export const stocksRouter = Router();

stocksRouter.get('/', StocksController.getAll);
stocksRouter.get('/:id', StocksController.getById);
stocksRouter.put('/:id', StocksController.save);
stocksRouter.post('/:id', StocksController.save);
stocksRouter.delete('/:id', StocksController.delete);
