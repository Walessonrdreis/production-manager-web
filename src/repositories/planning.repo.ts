import { db } from '../db';
import { type PlanningItem } from '../db/models';

export const PlanningRepository = {
  async getAll() {
    return await db.planning.toArray();
  },

  async add(item: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>) {
    const newItem: PlanningItem = {
      ...item,
      id: crypto.randomUUID(),
      synced: false,
      updatedAt: new Date().toISOString()
    };
    await db.planning.add(newItem);
    return newItem;
  },

  async update(id: string, updates: Partial<PlanningItem>) {
    await db.planning.update(id, {
      ...updates,
      synced: false,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(id: string) {
    await db.planning.delete(id);
  },

  async bulkAdd(items: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[]) {
    const newItems = items.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      synced: false,
      updatedAt: new Date().toISOString()
    }));
    await db.planning.bulkAdd(newItems);
    return newItems;
  },

  async markAsSynced(id: string) {
    await db.planning.update(id, { synced: true });
  }
};
