import { db } from '../../../db';
import { type ProducedRecord } from '../../../db/models';
import { ProductionLogic } from '../domain/ProductionLogic';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const ProducedRepository = {
  async getAll() {
    try {
      const { data: apiItems } = await apiClient.get<ProducedRecord[]>(ENDPOINTS.PRODUCTION.PRODUCED);
      if (apiItems && Array.isArray(apiItems)) {
        const localItems = await db.produced.toArray();
        const apiIds = new Set(apiItems.map(i => i.id));
        
        // Remove locais que sumiram na API e já estavam sincronizados
        for (const local of localItems) {
          if (!apiIds.has(local.id) && local.synced) {
            await db.produced.delete(local.id);
          }
        }

        // Salva/Atualiza com dados da API
        for (const apiItem of apiItems) {
          if (!apiItem.id) continue;
          await db.produced.put({ ...apiItem, synced: true });
        }
      }
    } catch (error) {
      console.warn('[ProducedRepository] Modo offline: não foi possível buscar produção da API.', error);
    }
    
    return await db.produced.toArray();
  },

  async getById(id: string) {
    return await db.produced.get(id);
  },

  async getByDescription(description: string) {
    return await db.produced.where('description').equals(description).toArray();
  },

  async save(record: Omit<ProducedRecord, 'updatedAt' | 'synced'>): Promise<ProducedRecord> {
    const newRecord: ProducedRecord = {
      ...record,
      synced: false,
      updatedAt: new Date().toISOString(),
    };
    
    await db.produced.put(newRecord);
    
    try {
      const { data } = await apiClient.post(ENDPOINTS.PRODUCTION.PRODUCED, newRecord);
      const updatedRecord = { ...newRecord, ...data, synced: true };
      await db.produced.put(updatedRecord);
      return updatedRecord;
    } catch (error) {
      console.warn('[ProducedRepository] Erro ao sincronizar item produzido na API:', error);
      return newRecord;
    }
  },

  async bulkSave(records: Omit<ProducedRecord, 'updatedAt' | 'synced'>[]): Promise<ProducedRecord[]> {
    const now = new Date().toISOString();
    const newRecords: ProducedRecord[] = records.map(r => ({
      ...r,
      synced: false,
      updatedAt: now,
    }));
    
    await db.produced.bulkPut(newRecords);
    
    try {
      const { data } = await apiClient.post(`${ENDPOINTS.PRODUCTION.PRODUCED}/bulk`, newRecords);
      const serverRecords = Array.isArray(data) ? data : newRecords;
      const syncedRecords = serverRecords.map(r => ({ ...r, synced: true }));
      await db.produced.bulkPut(syncedRecords);
      return syncedRecords;
    } catch (error) {
       console.warn('[ProducedRepository] Erro ao sincronizar itens produzidos em massa na API:', error);
       return newRecords;
    }
  },

  async bulkDelete(ids: string[]): Promise<void> {
    try {
       // Since the backend API doesn't support bulk delete, we do it in parallel or assume it's offline-only logic
       await Promise.all(ids.map(id => apiClient.delete(`${ENDPOINTS.PRODUCTION.PRODUCED}/${id}`)));
    } catch (error) {
       console.warn('[ProducedRepository] Erro ao deletar itens produzidos da API:', error);
    }
    await db.produced.bulkDelete(ids);
  },

  async markAsSynced(id: string) {
    try {
      // Força um envio de patch se precisasse, mas aqui é só setar local
    } catch (e) {}
    await db.produced.update(id, { synced: true });
  },

  async delete(id: string) {
    try {
      await apiClient.delete(`${ENDPOINTS.PRODUCTION.PRODUCED}/${id}`);
    } catch (error) {
      console.warn('[ProducedRepository] Erro ao deletar item produzido na API:', error);
    }
    await db.produced.delete(id);
  }
};
