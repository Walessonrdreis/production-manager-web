import { db } from '../../../db';
import { type ProducedRecord } from '../../../db/models';
import { ProductionLogic } from '../domain/ProductionLogic';

export const ProducedRepository = {
  async getAll() {
    return await db.produced.toArray();
  },

  async getById(id: string) {
    return await db.produced.get(id);
  },

  async getByDescription(description: string) {
    return await db.produced.where('description').equals(description).toArray();
  },

  async save(record: Omit<ProducedRecord, 'updatedAt' | 'synced'>) {
    const existing = await this.getById(record.id);
    const newRecord: ProducedRecord = {
      ...record,
      synced: false,
      updatedAt: new Date().toISOString(),
    };
    
    if (existing) {
      await db.produced.update(record.id, newRecord);
    } else {
      await db.produced.add(newRecord);
    }
    return newRecord;
  },

  async toggleOrder(id: string, description: string, quantity: number, orderId?: string, orderNumber?: string) {
    const existing = await this.getById(id);
    if (existing) {
      await db.produced.delete(id);
      return null;
    } else {
      const newRecord: ProducedRecord = {
        id,
        description,
        quantity,
        orderId,
        orderNumber,
        synced: false,
        updatedAt: new Date().toISOString(),
      };
      await db.produced.add(newRecord);
      return newRecord;
    }
  },

  async toggleAll(description: string, totalNeeded: number) {
    const existing = await this.getByDescription(description);
    const { idsToDelete, recordToAdd } = ProductionLogic.calculateToggleAllAction(
      description,
      totalNeeded,
      existing
    );

    if (idsToDelete.length > 0) {
      await db.produced.bulkDelete(idsToDelete);
    }

    if (recordToAdd) {
      const newRecord: ProducedRecord = {
        ...recordToAdd,
        synced: false,
        updatedAt: new Date().toISOString(),
      };
      await db.produced.add(newRecord);
      return [newRecord];
    }

    return [];
  },

  async markAsSynced(id: string) {
    await db.produced.update(id, { synced: true });
  },

  async delete(id: string) {
    await db.produced.delete(id);
  }
};
