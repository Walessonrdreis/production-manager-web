import { Request, NextFunction, Response } from 'express';
import { SyncClientsUseCase } from '../../../application/use-cases/SyncClientsUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class ClientsController {
  static async sync(req: Request, res: Response, next: NextFunction) {
    console.log('[SYNC] Clients Sync triggered via Domain Controller');
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 5000;
      const result = await SyncClientsUseCase.execute(page, pageSize);
      return HttpResponseBuilder.success(res, result.data, 200, result.count);
    } catch (err: any) {
      console.error('[SYNC CLIENTS ERROR]', err.message);
      next(err);
    }
  }
}
