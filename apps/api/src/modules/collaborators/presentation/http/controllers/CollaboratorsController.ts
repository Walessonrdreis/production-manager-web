import { Request, Response, NextFunction } from 'express';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';
import { GetCollaboratorsUseCase } from '../../../application/use-cases/GetCollaboratorsUseCase.js';
import { CreateCollaboratorUseCase } from '../../../application/use-cases/CreateCollaboratorUseCase.js';
import { UpdateCollaboratorUseCase } from '../../../application/use-cases/UpdateCollaboratorUseCase.js';
import { DeleteCollaboratorUseCase } from '../../../application/use-cases/DeleteCollaboratorUseCase.js';

export class CollaboratorsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetCollaboratorsUseCase.execute();
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CreateCollaboratorUseCase.execute(req.body);
      return HttpResponseBuilder.success(res, result.data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await UpdateCollaboratorUseCase.execute(id, req.body);
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await DeleteCollaboratorUseCase.execute(id);
      return HttpResponseBuilder.success(res, null, 200);
    } catch (err) {
      next(err);
    }
  }
}
