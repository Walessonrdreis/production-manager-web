import { Request, Response } from 'express';
import { GetProductionOrdersUseCase } from '../../../application/use-cases/GetProductionOrdersUseCase.js';
import { CreateProductionOrderUseCase } from '../../../application/use-cases/CreateProductionOrderUseCase.js';
import { UpdateProductionOrderUseCase } from '../../../application/use-cases/UpdateProductionOrderUseCase.js';
import { DeleteProductionOrderUseCase } from '../../../application/use-cases/DeleteProductionOrderUseCase.js';

export class ProductionOrdersController {
  static async getOrders(req: Request, res: Response) {
    try {
      const result = await GetProductionOrdersUseCase.execute();
      res.json(result.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch production orders' });
    }
  }

  static async createOrder(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await CreateProductionOrderUseCase.execute(data);
      res.status(201).json(result.data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create production order' });
    }
  }

  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await UpdateProductionOrderUseCase.execute(id, data);
      res.json(result.data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update production order' });
    }
  }

  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await DeleteProductionOrderUseCase.execute(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete production order' });
    }
  }
}
