import { Request, NextFunction, Response } from 'express';
import { SyncProductsUseCase } from '../../../application/use-cases/SyncProductsUseCase.js';
import { RefreshStockUseCase, GetAdminProductsUseCase, GetProductsListUseCase } from '../../../application/use-cases/ProductsUseCases.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class ProductsController {
  static async sync(req: Request, res: Response, next: NextFunction) {
    console.log('[SYNC] Products Sync triggered via Domain Controller');
    try {
      const limit = Number(req.query.limit) || 1000;
      const result = await SyncProductsUseCase.execute(limit);
      return HttpResponseBuilder.success(res, result.data, 200, result.count);
    } catch (err: any) {
      console.error('[SYNC PRODUCTS ERROR]', err.message);
      next(err);
    }
  }

  static async refreshStock(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RefreshStockUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getAdminProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetAdminProductsUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getProductsList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetProductsListUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
