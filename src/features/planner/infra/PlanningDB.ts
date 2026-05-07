import Dexie, { Table } from 'dexie';
import { PlanningItem, PlanningBatch } from '../../../db/models';

export class PlanningDB extends Dexie {
  items!: Table<PlanningItem>;
  batches!: Table<PlanningBatch>;
  config!: Table<{ key: string, value: any }>;

  constructor() {
    super('PlanningDB');
    this.version(2).stores({
      items: 'id, batchId, productCode, sectorId, synced, lastModified',
      batches: 'id, status, synced, lastModified',
      config: 'key'
    });
  }
}

export const planningDb = new PlanningDB();
