import { Request, NextFunction, Response } from 'express';
import { SyncProductsUseCase } from '../../../application/use-cases/SyncProductsUseCase.js';
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
}
