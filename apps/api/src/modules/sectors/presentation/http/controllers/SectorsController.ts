import { Request, Response, NextFunction } from 'express';
import { GetSectorsUseCase } from '../../../application/use-cases/GetSectorsUseCase.js';
import { CreateSectorUseCase } from '../../../application/use-cases/CreateSectorUseCase.js';
import { UpdateSectorUseCase } from '../../../application/use-cases/UpdateSectorUseCase.js';
import { DeleteSectorUseCase } from '../../../application/use-cases/DeleteSectorUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class SectorsController {
  static async getSectors(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetSectorsUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async createSector(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CreateSectorUseCase.execute(req.body);
      return HttpResponseBuilder.success(res, result.data, 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateSector(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UpdateSectorUseCase.execute(req.params.id, req.body);
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteSector(req: Request, res: Response, next: NextFunction) {
    try {
      await DeleteSectorUseCase.execute(req.params.id);
      return HttpResponseBuilder.success(res, null, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
