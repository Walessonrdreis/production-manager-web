import { PrismaProductionRepository } from '../../infrastructure/db/PrismaProductionRepository.js';

export class GetProducedUseCase {
  static async execute() {
    const internalData = await PrismaProductionRepository.getProducedRecords();
    
    // Merge data, avoiding duplicates if any logic applies, or just map them
    // Map internalData to the format expected by frontend (e.g. converting dates to strings if necessary)
    const formattedInternal = internalData.map(item => ({
      ...item,
      synced: item.synced,
      updatedAt: item.updatedAt.toISOString(),
    }));

    return { data: formattedInternal };
  }
}

export class GetProducedByIdUseCase {
  static async execute(id: string) {
    const internalData = await PrismaProductionRepository.getProducedRecord(id);
    if (internalData) {
      return { 
        data: {
          ...internalData,
          synced: internalData.synced,
          updatedAt: internalData.updatedAt.toISOString()
        }
      };
    }

    return { data: null };
  }
}

export class GetSchedulesUseCase {
  static async execute() {
    const internalData = await PrismaProductionRepository.getSchedules();

    const formattedInternal = internalData.map(item => ({
      ...item,
      synced: item.synced,
      scheduledAt: item.scheduledAt ? item.scheduledAt.toISOString() : null,
      updatedAt: item.updatedAt.toISOString(),
    }));

    return { data: formattedInternal };
  }
}

export class GetScheduleByIdUseCase {
  static async execute(id: string) {
    const internalData = await PrismaProductionRepository.getSchedule(id);
    if (internalData) {
      return {
        data: {
          ...internalData,
          synced: internalData.synced,
          scheduledAt: internalData.scheduledAt ? internalData.scheduledAt.toISOString() : null,
          updatedAt: internalData.updatedAt.toISOString(),
        }
      };
    }

    return { data: null };
  }
}

export class SaveProducedUseCase {
  static async execute(data: any) {
    const saved = await PrismaProductionRepository.saveProducedRecord(data);
    return { data: saved };
  }
}

export class UpdateProducedSyncUseCase {
  static async execute(id: string, synced: boolean) {
    const updated = await PrismaProductionRepository.updateProducedRecordSync(id, synced);
    return { data: updated };
  }
}

export class DeleteProducedUseCase {
  static async execute(id: string) {
    await PrismaProductionRepository.deleteProducedRecord(id);
    return { data: { success: true } };
  }
}

export class SaveScheduleUseCase {
  static async execute(data: any) {
    const saved = await PrismaProductionRepository.saveSchedule(data);
    return { data: saved };
  }
}

export class DeleteScheduleUseCase {
  static async execute(id: string) {
    await PrismaProductionRepository.deleteSchedule(id);
    return { data: { success: true } };
  }
}
