import { Request, Response, NextFunction } from 'express';
import { GetProducedUseCase, GetSchedulesUseCase } from '../../../application/use-cases/ProductionUseCases.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class ProductionController {
  static async getProduced(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetProducedUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetSchedulesUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
