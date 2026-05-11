import { Request, Response, NextFunction } from 'express';
import { GetStocksUseCase, GetStockByIdUseCase, SaveStockUseCase, DeleteStockUseCase } from '../../../application/use-cases/StocksUseCases.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class StocksController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await GetStocksUseCase.execute();
      return HttpResponseBuilder.success(res, data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await GetStockByIdUseCase.execute(id);
      if (!data) return HttpResponseBuilder.error(res, 'Stock not found', 404);
      return HttpResponseBuilder.success(res, data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async save(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await SaveStockUseCase.execute(id, data);
      return HttpResponseBuilder.success(res, result, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await DeleteStockUseCase.execute(id);
      return HttpResponseBuilder.success(res, null, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
