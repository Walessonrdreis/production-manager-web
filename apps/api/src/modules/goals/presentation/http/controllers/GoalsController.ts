import { Request, Response, NextFunction } from 'express';
import { GetGoalsUseCase } from '../../../application/use-cases/GetGoalsUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class GoalsController {
  static async getGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetGoalsUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
