import { Request, NextFunction, Response } from 'express';
import { SyncCatalogUseCase } from '../../../application/use-cases/SyncCatalogUseCase.js';
import { RefreshCatalogStockUseCase, GetAdminCatalogUseCase, GetCatalogListUseCase } from '../../../application/use-cases/CatalogUseCases.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class CatalogController {
  static async sync(req: Request, res: Response, next: NextFunction) {
    console.log('[SYNC] Catalog Sync triggered via Domain Controller');
    try {
      const limit = Number(req.query.limit) || 1000;
      const result = await SyncCatalogUseCase.execute(limit);
      return HttpResponseBuilder.success(res, result.data, 200, result.count);
    } catch (err: any) {
      console.error('[SYNC CATALOG ERROR]', err.message);
      next(err);
    }
  }

  static async refreshStock(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RefreshCatalogStockUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getAdminProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetAdminCatalogUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getCatalogList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetCatalogListUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
