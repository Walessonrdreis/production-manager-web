import { Request, Response, NextFunction } from 'express';
import { GetSectorsUseCase } from '../../../application/use-cases/GetSectorsUseCase.js';
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
}
