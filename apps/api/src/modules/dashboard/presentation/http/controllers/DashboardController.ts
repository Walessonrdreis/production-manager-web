import { Request, Response, NextFunction } from 'express';
import { GetStage20TotalsUseCase, GetDashboardProducedUseCase } from '../../../application/use-cases/DashboardUseCases.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class DashboardController {
  static async getStage20Totals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetStage20TotalsUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getProduced(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetDashboardProducedUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
