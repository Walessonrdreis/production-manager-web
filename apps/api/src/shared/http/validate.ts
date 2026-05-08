import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Safely assign back to request incase properties are getters (e.g. IncomingMessage)
      Object.defineProperty(req, 'body', { value: parsed.body, writable: true, enumerable: true, configurable: true });
      Object.defineProperty(req, 'query', { value: parsed.query, writable: true, enumerable: true, configurable: true });
      Object.defineProperty(req, 'params', { value: parsed.params, writable: true, enumerable: true, configurable: true });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError(`Validation Error: ${JSON.stringify(error.issues)}`, 400));
      } else {
        next(error);
      }
    }
  };
};
