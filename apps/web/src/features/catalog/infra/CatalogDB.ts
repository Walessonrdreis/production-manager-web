import Dexie, { Table } from 'dexie';
import { SavedProduct } from '../../../db/models';

export class CatalogDB extends Dexie {
  products!: Table<SavedProduct>;
  config!: Table<{ key: string, value: any }>;

  constructor() {
    super('CatalogDB');
    this.version(2).stores({
      products: 'id, code, description, *sectorIds, synced, lastModified',
      config: 'key'
    });
  }
}

export const catalogDb = new CatalogDB();
