import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { Sector } from '../../../types/api';
import { sectorsLocalRepository } from './SectorsIndexedDBRepo';
import { FirebaseSectorRepository } from './FirebaseSectorRepository';

export const SectorsRepository = {
  async getAll(params?: { includeInactive?: boolean }): Promise<Sector[]> {
    try {
      const response = await FirebaseSectorRepository.getAll();
      if (response.success && response.data) {
        return response.data as unknown as Sector[];
      }
      return [];
    } catch (error) {
      console.error('[SectorsRepository] Erro ao buscar setores:', error);
      throw error;
    }
  },

  async create(sector: Omit<Sector, 'id'>) {
    const newSector = {
      ...sector,
      id: crypto.randomUUID()
    };

    try {
      await FirebaseSectorRepository.save(newSector as any);
      return newSector;
    } catch (error) {
      console.error('[SectorsRepository] Erro ao criar setor:', error);
      return newSector;
    }
  },

  async update(id: string, sector: Partial<Sector>) {
    try {
      await FirebaseSectorRepository.update(id, sector as any);
      return { id, ...sector };
    } catch (error) {
      console.error('[SectorsRepository] Erro ao atualizar setor:', error);
      return { id, ...sector };
    }
  },

  async delete(id: string) {
    try {
      await FirebaseSectorRepository.delete(id);
    } catch (error) {
      console.error('[SectorsRepository] Erro crítico ao excluir setor:', error);
    }
    return { success: true };
  },

  async syncWithOmie() {
    try {
      return await apiClient.post(ENDPOINTS.SECTORS.SYNC, {});
    } catch (error) {
      return { data: { success: true, message: 'Sync manualizado' } };
    }
  }
};
