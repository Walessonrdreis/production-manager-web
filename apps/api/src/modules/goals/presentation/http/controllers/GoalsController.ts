import { Request, Response, NextFunction } from 'express';
import { GoalsUseCases } from '../../../application/use-cases/GoalsUseCases.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class GoalsController {
  static async getGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GoalsUseCases.getAll();
      return HttpResponseBuilder.success(res, result, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getGoalById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GoalsUseCases.getById(req.params.id);
      if (!result) return HttpResponseBuilder.error(res, 'Not found', 404);
      return HttpResponseBuilder.success(res, result, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GoalsUseCases.create(req.body);
      return HttpResponseBuilder.success(res, result, 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GoalsUseCases.update(req.params.id, req.body);
      return HttpResponseBuilder.success(res, result, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteGoal(req: Request, res: Response, next: NextFunction) {
    try {
      await GoalsUseCases.delete(req.params.id);
      return HttpResponseBuilder.success(res, { deleted: true }, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
