import { Request, Response, NextFunction } from 'express';
import { GetPlanningUseCase } from '../../../application/use-cases/GetPlanningUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class PlanningController {
  static async getPlanning(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetPlanningUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
