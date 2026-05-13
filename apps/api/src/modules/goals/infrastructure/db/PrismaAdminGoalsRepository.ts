import { AppError } from '../../../../shared/errors/AppError.js';
import { prisma } from '../../../../infra/prisma.js';
import { v4 as uuidv4 } from 'uuid';

export class PrismaAdminGoalsRepository {
  static async getAll() {
    try {
      const goals = await prisma.goal.findMany();
      return goals.map(g => ({
        ...g,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
        targetDate: g.targetDate.toISOString(),
      }));
    } catch (err: any) {
      throw new AppError(`Failed to fetch goals from Prisma: ${err.message}`, 500);
    }
  }

  static async getById(id: string) {
    try {
      const g = await prisma.goal.findUnique({ where: { id } });
      if (!g) return null;
      return {
        ...g,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
        targetDate: g.targetDate.toISOString(),
      };
    } catch (err: any) {
      throw new AppError(`Failed to fetch goal from Prisma: ${err.message}`, 500);
    }
  }

  static async save(goal: any) {
    try {
      const id = goal.id || uuidv4();
      const saved = await prisma.goal.create({
        data: {
          id,
          title: goal.title || '',
          description: goal.description || '',
          targetDate: goal.targetDate ? new Date(goal.targetDate) : new Date(),
          status: goal.status || 'PENDING',
        },
      });
      return {
        ...saved,
        createdAt: saved.createdAt.toISOString(),
        updatedAt: saved.updatedAt.toISOString(),
        targetDate: saved.targetDate.toISOString(),
      };
    } catch (err: any) {
      throw new AppError(`Failed to save goal to Prisma: ${err.message}`, 500);
    }
  }

  static async update(id: string, goal: any) {
    try {
      const dataToUpdate: any = { ...goal };
      if (goal.targetDate) dataToUpdate.targetDate = new Date(goal.targetDate);
      
      const updated = await prisma.goal.update({
        where: { id },
        data: dataToUpdate,
      });
      return {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        targetDate: updated.targetDate.toISOString(),
      };
    } catch (err: any) {
      throw new AppError(`Failed to update goal in Prisma: ${err.message}`, 500);
    }
  }

  static async delete(id: string) {
    try {
      await prisma.goal.delete({ where: { id } });
    } catch (err: any) {
      throw new AppError(`Failed to delete goal from Prisma: ${err.message}`, 500);
    }
  }
}
