import Dexie, { type Table } from 'dexie';
import { type ProducedRecord, type PlanningItem, type APICache } from './models';

export class ProductionDatabase extends Dexie {
  produced!: Table<ProducedRecord>;
  planning!: Table<PlanningItem>;
  cache!: Table<APICache>;

  constructor() {
    super('ProductionManagerDB');
    
    this.version(2).stores({
      produced: 'id, description, synced',
      planning: 'id, code, synced',
      cache: 'key, expiresAt'
    });
  }
}

export const db = new ProductionDatabase();
