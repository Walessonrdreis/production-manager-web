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

  async save(record: Omit<ProducedRecord, 'updatedAt' | 'synced'>): Promise<ProducedRecord> {
    const newRecord: ProducedRecord = {
      ...record,
      synced: false,
      updatedAt: new Date().toISOString(),
    };
    
    await db.produced.put(newRecord);
    return newRecord;
  },

  async bulkSave(records: Omit<ProducedRecord, 'updatedAt' | 'synced'>[]): Promise<ProducedRecord[]> {
    const now = new Date().toISOString();
    const newRecords: ProducedRecord[] = records.map(r => ({
      ...r,
      synced: false,
      updatedAt: now,
    }));
    
    await db.produced.bulkPut(newRecords);
    return newRecords;
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await db.produced.bulkDelete(ids);
  },

  async markAsSynced(id: string) {
    await db.produced.update(id, { synced: true });
  },

  async delete(id: string) {
    await db.produced.delete(id);
  }
};
