import { prisma } from '../../../../infra/prisma.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class PrismaProductionRepository {
  // --- ProducedRecords ---
  static async getProducedRecords() {
    const records = await prisma.producedRecord.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return records;
  }

  static async getProducedRecord(id: string) {
    const record = await prisma.producedRecord.findUnique({ where: { id } });
    return record;
  }

  static async saveProducedRecord(data: any) {
    const record = await prisma.producedRecord.upsert({
      where: { id: data.id },
      update: {
        description: data.description,
        quantity: data.quantity,
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        synced: true,
      },
      create: {
        id: data.id,
        description: data.description,
        quantity: data.quantity,
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        synced: true,
      }
    });
    return record;
  }

  static async updateProducedRecordSync(id: string, synced: boolean) {
    const record = await prisma.producedRecord.update({
      where: { id },
      data: { synced }
    });
    return record;
  }

  static async deleteProducedRecord(id: string) {
    try {
      await prisma.producedRecord.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new AppError('Record not found', 404);
      }
      throw error;
    }
  }

  // --- ProductionSchedules ---
  static async getSchedules() {
    const schedules = await prisma.productionSchedule.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return schedules;
  }

  static async getSchedule(id: string) {
    const schedule = await prisma.productionSchedule.findUnique({ where: { id } });
    return schedule;
  }

  static async saveSchedule(data: any) {
    const schedule = await prisma.productionSchedule.upsert({
      where: { id: data.id },
      update: {
        productCode: data.productCode,
        description: data.description,
        quantity: data.quantity,
        sectorId: data.sectorId,
        sectorName: data.sectorName,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        notes: data.notes,
        synced: true,
      },
      create: {
        id: data.id,
        productCode: data.productCode,
        description: data.description,
        quantity: data.quantity,
        sectorId: data.sectorId,
        sectorName: data.sectorName,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        notes: data.notes,
        synced: true,
      }
    });
    return schedule;
  }

  static async deleteSchedule(id: string) {
    try {
      await prisma.productionSchedule.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new AppError('Record not found', 404);
      }
      throw error;
    }
  }
}
