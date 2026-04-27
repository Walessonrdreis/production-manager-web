import Dexie, { type Table } from 'dexie';
import { Product, Planning } from '../types/api';

export class ProductionManagerDB extends Dexie {
  myProducts!: Table<Product>;
  planningItems!: Table<Planning & { plannedQuantity: number; productId: string }>;

  constructor() {
    super('ProductionManagerDB');
    this.version(1).stores({
      myProducts: 'id, code, description',
      planningItems: '++id, productId, status'
    });
  }
}

export const db = new ProductionManagerDB();
