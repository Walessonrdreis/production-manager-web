import { AppError } from '../../../../shared/errors/AppError.js';
import { prisma } from '../../../../infra/prisma.js';
import { v4 as uuidv4 } from 'uuid';

export class PrismaAdminCollaboratorsRepository {
  static async getAll() {
    try {
      const collabs = await prisma.collaborator.findMany();
      return collabs.map(c => ({
        ...c,
        metrics: c.metrics ? JSON.parse(c.metrics) : undefined,
      }));
    } catch (err: any) {
      throw new AppError(`Failed to fetch collaborators from Prisma: ${err.message}`, 500);
    }
  }

  static async getById(id: string) {
    try {
      const c = await prisma.collaborator.findUnique({ where: { id } });
      if (!c) return null;
      return {
        ...c,
        metrics: c.metrics ? JSON.parse(c.metrics) : undefined,
      };
    } catch (err: any) {
      throw new AppError(`Failed to fetch collaborator from Prisma: ${err.message}`, 500);
    }
  }

  static async save(collaborator: any) {
    try {
      const id = collaborator.id || uuidv4();
      const saved = await prisma.collaborator.upsert({
        where: { id },
        update: {
          name: collaborator.name,
          role: collaborator.role,
          sectorId: collaborator.sectorId,
          category: collaborator.category,
          dailyGoal: collaborator.dailyGoal ? Number(collaborator.dailyGoal) : undefined,
          status: collaborator.status || 'active',
          metrics: collaborator.metrics ? JSON.stringify(collaborator.metrics) : undefined,
        },
        create: {
          id,
          name: collaborator.name,
          role: collaborator.role,
          sectorId: collaborator.sectorId,
          category: collaborator.category,
          dailyGoal: collaborator.dailyGoal ? Number(collaborator.dailyGoal) : undefined,
          status: collaborator.status || 'active',
          metrics: collaborator.metrics ? JSON.stringify(collaborator.metrics) : undefined,
        },
      });
      return {
        ...saved,
        metrics: saved.metrics ? JSON.parse(saved.metrics) : undefined,
      };
    } catch (err: any) {
      throw new AppError(`Failed to save collaborator to Prisma: ${err.message}`, 500);
    }
  }

  static async update(id: string, collaborator: any) {
    try {
      const dataToUpdate: any = {};
      if (collaborator.name !== undefined) dataToUpdate.name = collaborator.name;
      if (collaborator.role !== undefined) dataToUpdate.role = collaborator.role;
      if (collaborator.sectorId !== undefined) dataToUpdate.sectorId = collaborator.sectorId;
      if (collaborator.category !== undefined) dataToUpdate.category = collaborator.category;
      if (collaborator.status !== undefined) dataToUpdate.status = collaborator.status;
      if (collaborator.metrics !== undefined) dataToUpdate.metrics = JSON.stringify(collaborator.metrics);
      if (collaborator.dailyGoal !== undefined) dataToUpdate.dailyGoal = Number(collaborator.dailyGoal);

      const updated = await prisma.collaborator.update({
        where: { id },
        data: dataToUpdate,
      });
      return {
        ...updated,
        metrics: updated.metrics ? JSON.parse(updated.metrics) : undefined,
      };
    } catch (err: any) {
      throw new AppError(`Failed to update collaborator in Prisma: ${err.message}`, 500);
    }
  }

  static async delete(id: string) {
    try {
      await prisma.collaborator.delete({ where: { id } });
    } catch (err: any) {
      throw new AppError(`Failed to delete collaborator from Prisma: ${err.message}`, 500);
    }
  }
}
