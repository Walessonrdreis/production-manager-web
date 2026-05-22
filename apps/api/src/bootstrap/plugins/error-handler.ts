import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError.js';
import { HttpResponseBuilder } from '../../shared/http/response.js';

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("[GLOBAL ERROR FULL]", err);
  // Se for erro de validação (simulando comportamento do fastify err.validation)
  if (err.validation || (err.code && String(err.code).includes('validation')) || err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: err.message || 'Validation error'
    });
  }

  // Caso contrário, erro padrão
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: err.message || 'Unexpected error'
  });
}
