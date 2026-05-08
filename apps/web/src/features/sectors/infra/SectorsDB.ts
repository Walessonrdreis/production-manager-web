import Dexie, { Table } from 'dexie';
import { SectorSync } from '../../../db/models';

export class SectorsDB extends Dexie {
  sectors!: Table<SectorSync>;
  config!: Table<{ key: string, value: any }>;

  constructor() {
    super('SectorsDB');
    this.version(2).stores({
      sectors: 'id, name, *productCodes, synced, lastModified',
      config: 'key'
    });
  }
}

export const sectorsDb = new SectorsDB();
