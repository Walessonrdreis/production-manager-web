import { type PlanningItem } from '../../../db/models';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const PlanningRepository = {
  async getAll(): Promise<PlanningItem[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.PLANNING.BASE, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404
      });
      if (response.status === 404) return [];
      if (response.data && response.data.data) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.warn('[PlanningRepository] falha ao buscar planejamento da API:', error);
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
      await apiClient.post(ENDPOINTS.PLANNING.BASE, newItem, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404
      });
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao salvar planejamento na API:', error);
    }
    return newItem;
  },

  async update(id: string, updates: Partial<PlanningItem>) {
    try {
      await apiClient.put(`${ENDPOINTS.PLANNING.BASE}/${id}`, updates, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404
      });
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao atualizar planejamento na API:', error);
    }
  },

  async delete(id: string) {
    try {
      await apiClient.delete(`${ENDPOINTS.PLANNING.BASE}/${id}`, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404
      });
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
