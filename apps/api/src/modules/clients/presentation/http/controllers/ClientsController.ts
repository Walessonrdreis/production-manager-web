import { Request, NextFunction, Response } from 'express';
import { SyncClientsUseCase } from '../../../application/use-cases/SyncClientsUseCase.js';
import { GetClientsListUseCase } from '../../../application/use-cases/GetClientsListUseCase.js';
import { HttpResponseBuilder } from '../../../../../shared/http/response.js';
import { legacyPrisma } from '../../../../../infra/prisma.js';

export class ClientsController {
  static async sync(req: Request, res: Response, next: NextFunction) {
    console.log('[SYNC] Clients Sync triggered via Domain Controller');
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 5000;
      const result = await SyncClientsUseCase.execute(page, pageSize);
      return HttpResponseBuilder.success(res, result.data, 200, result.count);
    } catch (err: any) {
      console.error('[SYNC CLIENTS ERROR]', err.message);
      next(err);
    }
  }

  static async getClientsList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GetClientsListUseCase.execute(req.query);
      return HttpResponseBuilder.success(res, result.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async getClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const client = await legacyPrisma.customer.findUnique({
        where: { id: req.params.id }
      });
      if (!client) return HttpResponseBuilder.error(res, 'Client not found', 404);
      return HttpResponseBuilder.success(res, typeof client.data === 'string' ? JSON.parse(client.data) : client.data, 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async createClient(req: Request, res: Response, next: NextFunction) {
    try {
      const input = { id: req.body.id || crypto.randomUUID(), ...req.body };
      const saved = await legacyPrisma.customer.create({
        data: { id: input.id, data: JSON.stringify(input) }
      });
      return HttpResponseBuilder.success(res, JSON.parse(saved.data), 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateClient(req: Request, res: Response, next: NextFunction) {
    try {
      const input = { ...req.body, id: req.params.id };
      const updated = await legacyPrisma.customer.upsert({
        where: { id: req.params.id },
        update: { data: JSON.stringify(input) },
        create: { id: req.params.id, data: JSON.stringify(input) }
      });
      return HttpResponseBuilder.success(res, JSON.parse(updated.data), 200);
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteClient(req: Request, res: Response, next: NextFunction) {
    try {
      await legacyPrisma.customer.delete({
        where: { id: req.params.id }
      });
      return HttpResponseBuilder.success(res, { success: true }, 200);
    } catch (err: any) {
      next(err);
    }
  }
}
