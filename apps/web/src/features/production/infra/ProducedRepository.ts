import { type ProducedRecord } from '../../../db/models';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const ProducedRepository = {
  async getAll(): Promise<ProducedRecord[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTION.PRODUCED);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('[ProducedRepository] falha ao buscar produced da API:', error);
      return [];
    }
  },

  async getById(id: string): Promise<ProducedRecord | null> {
    try {
      const response = await apiClient.get(`${ENDPOINTS.PRODUCTION.PRODUCED}/${id}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('[ProducedRepository] falha ao buscar item por id:', error);
      return null;
    }
  },

  async getByDescription(description: string) {
    const all = await this.getAll();
    return all.filter(p => p.description === description);
  },

  async save(record: Omit<ProducedRecord, 'updatedAt' | 'synced'>): Promise<ProducedRecord> {
    const newRecord: ProducedRecord = {
      ...record,
      id: record.id || uuidv4(),
      synced: true,
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await apiClient.post(ENDPOINTS.PRODUCTION.PRODUCED, newRecord);
    } catch (error) {
      console.error('[ProducedRepository] Erro ao sincronizar item produzido:', error);
    }
    return newRecord;
  },

  async bulkSave(records: Omit<ProducedRecord, 'updatedAt' | 'synced'>[]): Promise<ProducedRecord[]> {
    const promises = records.map(r => this.save(r));
    return await Promise.all(promises);
  },

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map(id => this.delete(id)));
    } catch (error) {
      console.error('[ProducedRepository] Erro ao deletar itens produzidos:', error);
    }
  },

  async markAsSynced(id: string) {
    try {
      await apiClient.put(`${ENDPOINTS.PRODUCTION.PRODUCED}/${id}`, { synced: true });
    } catch (error) {
      console.error('[ProducedRepository] falha ao marcar como synced:', error);
    }
  },

  async delete(id: string) {
    try {
      await apiClient.delete(`${ENDPOINTS.PRODUCTION.PRODUCED}/${id}`);
    } catch (error) {
      console.error('[ProducedRepository] Erro ao deletar item produzido:', error);
    }
  }
};
