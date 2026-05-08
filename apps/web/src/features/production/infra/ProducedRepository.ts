import { type ProducedRecord } from '../../../db/models';
import { FirebaseProductionRepository } from './FirebaseProductionRepository';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const ProducedRepository = {
  async getAll() {
    try {
      const response = await FirebaseProductionRepository.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.warn('[ProducedRepository] Modo offline: não foi possível buscar da API.', error);
      return [];
    }
  },

  async getById(id: string) {
    const res = await FirebaseProductionRepository.getById(id);
    return res.data;
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
      await FirebaseProductionRepository.save(newRecord);
    } catch (error) {
      console.warn('[ProducedRepository] Erro ao sincronizar item produzido:', error);
    }
    return newRecord;
  },

  async bulkSave(records: Omit<ProducedRecord, 'updatedAt' | 'synced'>[]): Promise<ProducedRecord[]> {
    const now = new Date().toISOString();
    const newRecords: ProducedRecord[] = records.map(r => ({
      ...r,
      id: r.id || uuidv4(),
      synced: true,
      updatedAt: now,
    }));
    
    try {
      for (const item of newRecords) {
        await FirebaseProductionRepository.save(item);
      }
    } catch (error) {
       console.warn('[ProducedRepository] Erro ao sincronizar itens produzidos em massa:', error);
    }
    return newRecords;
  },

  async bulkDelete(ids: string[]): Promise<void> {
    try {
       await Promise.all(ids.map(id => {
         return FirebaseProductionRepository.delete(id);
       }));
    } catch (error) {
       console.warn('[ProducedRepository] Erro ao deletar itens produzidos:', error);
    }
  },

  async markAsSynced(id: string) {
    try {
      await FirebaseProductionRepository.update(id, { synced: true });
    } catch (e) {}
  },

  async delete(id: string) {
    try {
      await FirebaseProductionRepository.delete(id);
    } catch (error) {
      console.warn('[ProducedRepository] Erro ao deletar item produzido:', error);
    }
  }
};
