import Dexie, { type Table } from 'dexie';
import { type ProducedRecord, type PlanningItem, type APICache, type SavedProduct, type Customer } from './models';
import { type Sector } from '../types/api';

export class ProductionDatabase extends Dexie {
  produced!: Table<ProducedRecord>;
  planning!: Table<PlanningItem>;
  myProducts!: Table<SavedProduct>;
  customers!: Table<Customer>;
  cache!: Table<APICache>;
  sectors!: Table<Sector>;

  constructor() {
    super('ProductionManagerDB');
    
    this.version(6).stores({
      produced: 'id, description, synced, updatedAt',
      planning: 'id, code, synced, updatedAt',
      myProducts: 'id, code, description, savedAt',
      customers: 'id, name, document, omieCode',
      cache: 'key, expiresAt',
      sectors: 'id, name'
    });
  }
}

export const db = new ProductionDatabase();
