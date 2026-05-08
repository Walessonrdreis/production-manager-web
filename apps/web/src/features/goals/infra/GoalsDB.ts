import Dexie, { Table } from 'dexie';
import { ProductionGoal } from '../domain/Goal';

export class GoalsDB extends Dexie {
  goals!: Table<ProductionGoal>;

  constructor() {
    super('GoalsDB');
    this.version(1).stores({
      goals: 'id, productCode, period, sectorId, synced, lastModified'
    });
  }
}

export const goalsDb = new GoalsDB();
