import { Request, NextFunction, Response } from 'express';
import { SyncOrdersUseCase } from '../../../application/use-cases/SyncOrdersUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class OrdersController {
  static async sync(req: Request, res: Response, next: NextFunction) {
    console.log('[SYNC] Orders Sync triggered via Domain Controller');
    try {
      const result = await SyncOrdersUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200, result.count);
    } catch (err: any) {
      console.error('[SYNC ORDERS ERROR]', err.message);
      next(err);
    }
  }
}
