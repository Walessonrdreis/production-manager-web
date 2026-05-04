import { db } from '../../../db';
import { ProductionSchedule } from '../../../db/models';

export const ScheduleRepository = {
  async getAll(): Promise<ProductionSchedule[]> {
    return db.productionSchedules.toArray();
  },

  async save(schedule: ProductionSchedule): Promise<void> {
    await db.productionSchedules.put(schedule);
  },

  async delete(description: string): Promise<void> {
    await db.productionSchedules.delete(description);
  }
};
