import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError.js';
import { HttpResponseBuilder } from '../../shared/http/response.js';

export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return HttpResponseBuilder.error(res, err.message, err.statusCode);
  }

  console.error('[UNHANDLED ERROR]', err);
  return HttpResponseBuilder.error(res, 'Internal server error', 500);
}
