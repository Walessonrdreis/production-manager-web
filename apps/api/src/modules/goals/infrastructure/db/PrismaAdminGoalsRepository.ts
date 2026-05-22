import { AppError } from '../../../../shared/errors/AppError.js';
import { legacyPrisma } from '../../../../infra/prisma.js';
import { v4 as uuidv4 } from 'uuid';

export class PrismaAdminGoalsRepository {
  static async getAll() {
    try {
      const goals = await legacyPrisma.goal.findMany();
      return goals.map(g => ({
        ...g,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
      }));
    } catch (err: any) {
      throw new AppError(`Failed to fetch goals from Prisma: ${err.message}`, 500);
    }
  }

  static async getById(id: string) {
    try {
      const g = await legacyPrisma.goal.findUnique({ where: { id } });
      if (!g) return null;
      return {
        ...g,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
      };
    } catch (err: any) {
      throw new AppError(`Failed to fetch goal from Prisma: ${err.message}`, 500);
    }
  }

  static async save(goal: any) {
    try {
      const id = goal.id || uuidv4();
      const saved = await legacyPrisma.goal.upsert({
        where: { id },
        update: {
          type: goal.type || 'product',
          productCode: goal.productCode || null,
          productDescription: goal.productDescription || null,
          collaboratorId: goal.collaboratorId || null,
          collaboratorName: goal.collaboratorName || null,
          sectorId: goal.sectorId || null,
          sectorName: goal.sectorName || null,
          targetQuantity: Number(goal.targetQuantity) || 0,
          period: goal.period || 'monthly',
          isActive: goal.isActive !== undefined ? goal.isActive : true,
          synced: goal.synced !== undefined ? goal.synced : true,
          lastModified: goal.lastModified ? String(goal.lastModified) : null,
        },
        create: {
          id,
          type: goal.type || 'product',
          productCode: goal.productCode || null,
          productDescription: goal.productDescription || null,
          collaboratorId: goal.collaboratorId || null,
          collaboratorName: goal.collaboratorName || null,
          sectorId: goal.sectorId || null,
          sectorName: goal.sectorName || null,
          targetQuantity: Number(goal.targetQuantity) || 0,
          period: goal.period || 'monthly',
          isActive: goal.isActive !== undefined ? goal.isActive : true,
          synced: goal.synced !== undefined ? goal.synced : true,
          lastModified: goal.lastModified ? String(goal.lastModified) : null,
        },
      });
      return {
        ...saved,
        createdAt: saved.createdAt.toISOString(),
        updatedAt: saved.updatedAt.toISOString(),
      };
    } catch (err: any) {
      throw new AppError(`Failed to save goal to Prisma: ${err.message}`, 500);
    }
  }

  static async update(id: string, goal: any) {
    try {
      const dataToUpdate: any = { ...goal };
      
      const updated = await legacyPrisma.goal.update({
        where: { id },
        data: dataToUpdate,
      });
      return {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (err: any) {
      throw new AppError(`Failed to update goal in Prisma: ${err.message}`, 500);
    }
  }

  static async delete(id: string) {
    try {
      await legacyPrisma.goal.delete({ where: { id } });
    } catch (err: any) {
      throw new AppError(`Failed to delete goal from Prisma: ${err.message}`, 500);
    }
  }
}
