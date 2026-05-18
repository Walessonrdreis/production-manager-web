import { Request, Response, NextFunction } from 'express';
import { GetPlanningUseCase } from '../../../application/use-cases/GetPlanningUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';
import { prisma } from '../../../../../infra/prisma.js';

export class PlanningController {
  static async getPlanning(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetPlanningUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async savePlanning(req: Request, res: Response, next: NextFunction) {
    try {
      const { lastModified, version, ...item } = req.body;
      const created = await prisma.planningItem.upsert({
        where: { id: item.id },
        update: item,
        create: item
      });
      return HttpResponseBuilder.success(res, created, 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updatePlanning(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { lastModified, version, createdAt, ...item } = req.body;
      const updated = await prisma.planningItem.update({
        where: { id },
        data: item
      });
      return HttpResponseBuilder.success(res, updated, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async deletePlanning(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.planningItem.delete({ where: { id } });
      return HttpResponseBuilder.success(res, null, 204);
    } catch (err: any) {
      next(err);
    }
  }
}
