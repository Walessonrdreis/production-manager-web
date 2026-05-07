import { type PlanningItem } from '../../../db/models';
import { planningLocalRepository } from './PlanningIndexedDBRepo';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const PlanningRepository = {
  async getAll() {
    // Busca do IndexedDB local e da API
    try {
      const { data: apiItems } = await apiClient.get<PlanningItem[]>(ENDPOINTS.PLANNING.BASE);
      
      if (apiItems && Array.isArray(apiItems)) {
        const localItems = await planningLocalRepository.getAllItems();
        const apiIds = new Set(apiItems.map(i => i.id));
        
        // Remove locais que sumiram na API e já estavam sincronizados
        for (const local of localItems) {
          if (!apiIds.has(local.id) && local.synced) {
            await planningLocalRepository.deleteItem(local.id);
          }
        }

        // Salva/Atualiza com dados da API
        for (const apiItem of apiItems) {
          await planningLocalRepository.saveItem({ ...apiItem, synced: true });
        }
      }
    } catch (error) {
      console.warn('[PlanningRepository] Modo offline: não foi possível buscar da API.', error);
    }
    
    return await planningLocalRepository.getAllItems();
  },

  async add(item: Omit<PlanningItem, 'id' | 'synced' | 'lastModified' | 'version' | 'updatedAt'>) {
    const newItem: PlanningItem = {
      ...item,
      id: uuidv4(),
      synced: false,
      lastModified: Date.now(),
      version: 1,
      updatedAt: new Date().toISOString()
    };
    
    // Salva local (Offline-first)
    await planningLocalRepository.saveItem(newItem);
    
    // Tenta API
    try {
      const { data } = await apiClient.post(ENDPOINTS.PLANNING.BASE, newItem);
      await planningLocalRepository.saveItem({ ...newItem, ...data, synced: true });
      return data || newItem;
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao sincronizar planejamento na API:', error);
      return newItem;
    }
  },

  async update(id: string, updates: Partial<PlanningItem>) {
    const existing = await planningLocalRepository.getAllItems().then(items => items.find(i => i.id === id));
    if (!existing) return;

    const updated = {
      ...existing,
      ...updates,
      synced: false,
      lastModified: Date.now(),
      updatedAt: new Date().toISOString()
    };
    
    // Atualiza local (Offline-first)
    await planningLocalRepository.saveItem(updated);

    // Tenta API
    try {
      const { data } = await apiClient.patch(`${ENDPOINTS.PLANNING.BASE}/${id}`, updates);
      await planningLocalRepository.saveItem({ ...updated, ...data, synced: true });
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao atualizar planejamento na API:', error);
    }
  },

  async delete(id: string) {
    // Tenta API
    try {
      await apiClient.delete(`${ENDPOINTS.PLANNING.BASE}/${id}`);
    } catch (error) {
      console.warn('[PlanningRepository] Erro ao deletar planejamento na API:', error);
    }

    // Deleta local (seja falha ou não)
    await planningLocalRepository.deleteItem(id);
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
    const all = await planningLocalRepository.getAllItems();
    return Promise.all(all.map(i => this.delete(i.id)));
  }
};
