import { Response } from 'express';

// Based on Result Pattern from AGENTS.md
export interface HttpResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export class HttpResponseBuilder {
  static success<T>(res: Response, data?: T, statusCode: number = 200, count?: number): Response {
    const payload: HttpResponse<T> = { success: true, data };
    if (count !== undefined) payload.count = count;
    return res.status(statusCode).json(payload);
  }

  static error(res: Response, error: string, statusCode: number = 400): Response {
    return res.status(statusCode).json({ success: false, error });
  }
}
