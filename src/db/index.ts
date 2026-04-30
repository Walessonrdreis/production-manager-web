import Dexie, { type Table } from 'dexie';
import { type ProducedRecord, type PlanningItem, type APICache, type SavedProduct, type Customer } from './models';

export class ProductionDatabase extends Dexie {
  produced!: Table<ProducedRecord>;
  planning!: Table<PlanningItem>;
  myProducts!: Table<SavedProduct>;
  customers!: Table<Customer>;
  cache!: Table<APICache>;

  constructor() {
    super('ProductionManagerDB');
    
    this.version(5).stores({
      produced: 'id, description, synced, updatedAt',
      planning: 'id, code, synced, updatedAt',
      myProducts: 'id, code, description, savedAt',
      customers: 'id, name, document, omieCode',
      cache: 'key, expiresAt'
    });
  }
}

export const db = new ProductionDatabase();
