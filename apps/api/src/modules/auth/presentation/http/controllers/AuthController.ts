import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await LoginUseCase.execute(req.body);
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
