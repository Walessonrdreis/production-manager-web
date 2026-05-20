import { Request, Response, NextFunction } from 'express';
import { GetStage20TotalsUseCase } from '../../../application/use-cases/ProductionControlUseCases.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class ProductionControlController {
  static async getStage20Totals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetStage20TotalsUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
