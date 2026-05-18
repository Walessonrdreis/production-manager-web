import { Request, Response, NextFunction } from 'express';
import { GetProducedUseCase, GetProducedByIdUseCase, GetSchedulesUseCase, GetScheduleByIdUseCase, SaveProducedUseCase, UpdateProducedSyncUseCase, DeleteProducedUseCase, SaveScheduleUseCase, DeleteScheduleUseCase } from '../../../application/use-cases/ProductionUseCases.js';
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

  static async getProducedById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetProducedByIdUseCase.execute(req.params.id);
      if (!result.data) {
         return HttpResponseBuilder.error(res, 'Record not found', 404);
      }
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async saveProduced(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SaveProducedUseCase.execute(req.body);
      return HttpResponseBuilder.success(res, result.data, 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateProducedSync(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UpdateProducedSyncUseCase.execute(req.params.id, req.body.synced);
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteProduced(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DeleteProducedUseCase.execute(req.params.id);
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

  static async getScheduleById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetScheduleByIdUseCase.execute(req.params.id);
      if (!result.data) {
         return HttpResponseBuilder.error(res, 'Record not found', 404);
      }
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async saveSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SaveScheduleUseCase.execute(req.body);
      return HttpResponseBuilder.success(res, result.data, 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await DeleteScheduleUseCase.execute(req.params.id);
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
