import Dexie, { type Table } from 'dexie';
import { type ProducedRecord, type PlanningItem, type APICache, type SavedProduct, type Customer, type ProductionSchedule } from './models';
import { type Sector } from '../types/api';

export class ProductionDatabase extends Dexie {
  produced!: Table<ProducedRecord>;
  planning!: Table<PlanningItem>;
  myProducts!: Table<SavedProduct>;
  customers!: Table<Customer>;
  cache!: Table<APICache>;
  sectors!: Table<Sector>;
  productionSchedules!: Table<ProductionSchedule>;

  constructor() {
    super('ProductionManagerDB');
    
    this.version(7).stores({
      produced: 'id, description, synced, updatedAt',
      planning: 'id, code, synced, updatedAt',
      myProducts: 'id, code, description, savedAt',
      customers: 'id, name, document, omieCode',
      cache: 'key, expiresAt',
      sectors: 'id, name',
      productionSchedules: 'description, scheduledAt, updatedAt'
    });
  }
}

export const db = new ProductionDatabase();
