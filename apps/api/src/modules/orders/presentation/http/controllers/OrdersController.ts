import { Request, NextFunction, Response } from 'express';
import { SyncOrdersUseCase } from '../../../application/use-cases/SyncOrdersUseCase.js';
import { GetOrdersListUseCase } from '../../../application/use-cases/GetOrdersListUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class OrdersController {
  static async sync(req: Request, res: Response, next: NextFunction) {
    console.log('[SYNC] Orders Sync triggered via Domain Controller');
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 200;
      const result = await SyncOrdersUseCase.execute(page, pageSize);
      return HttpResponseBuilder.success(res, result.data, 200, result.count);
    } catch (err: any) {
      console.error('[SYNC ORDERS ERROR]', err.message);
      next(err);
    }
  }

  static async getOrdersList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetOrdersListUseCase.execute(req.query);
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
