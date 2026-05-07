import { type PlanningItem } from '../../../db/models';
import { v4 as uuidv4 } from 'uuid';
import { FirebasePlanningRepository } from '../../planning/infra/FirebasePlanningRepository';

export const PlanningRepository = {
  async getAll() {
    try {
      const response = await FirebasePlanningRepository.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.warn('[PlanningRepository] Modo offline: não foi possível buscar da API.', error);
      return [];
    }
  },

  async add(item: Omit<PlanningItem, 'id' | 'synced' | 'lastModified' | 'version' | 'updatedAt'>) {
    const newItem: PlanningItem = {
      ...item,
      id: uuidv4(),
      synced: true,
      lastModified: Date.now(),
      version: 1,
      updatedAt: new Date().toISOString()
    };
    
    try {
      await FirebasePlanningRepository.save(newItem);
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao sincronizar planejamento na API:', error);
    }
    return newItem;
  },

  async update(id: string, updates: Partial<PlanningItem>) {
    try {
      await FirebasePlanningRepository.update(id, updates);
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao atualizar planejamento na API:', error);
    }
  },

  async delete(id: string) {
    try {
      await FirebasePlanningRepository.delete(id);
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao deletar planejamento na API:', error);
    }
  },

  async bulkAdd(items: Omit<PlanningItem, 'id' | 'synced' | 'lastModified' | 'version' | 'updatedAt'>[]) {
    const promises = items.map(item => this.add(item));
    return await Promise.all(promises);
  },

  async bulkUpdate(updates: { id: string, quantity: number }[]) {
    const promises = updates.map(u => this.update(u.id, { quantity: u.quantity }));
    await Promise.all(promises);
  },

  async clear() {
    const all = await this.getAll();
    return Promise.all(all.map(i => this.delete(i.id)));
  }
};
