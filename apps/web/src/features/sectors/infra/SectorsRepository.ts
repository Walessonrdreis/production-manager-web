import { Sector } from '../../../types/api';
import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const SectorsRepository = {
  async getAll(params?: { includeInactive?: boolean }): Promise<Sector[]> {
    try {
      const response = await apiClient.get(ENDPOINTS.SECTORS.BASE, { params });
      
      if (Array.isArray(response.data)) {
        return response.data;
      } 
      else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      else if (response.data?.sectors && Array.isArray(response.data.sectors)) {
        return response.data.sectors;
      }
      
      return [];
    } catch (error) {
      console.error('[SectorsRepository] Erro ao buscar setores:', error);
      throw error;
    }
  },

  async create(sector: Omit<Sector, 'id'>): Promise<Sector> {
    try {
      const response = await apiClient.post(ENDPOINTS.SECTORS.BASE, sector);
      
      if (response.data?.data) {
        return response.data.data;
      } else if (response.data?.id) {
        return response.data;
      } else if (response.data?.sector) {
        return response.data.sector;
      }
      
      throw new Error('Formato de resposta inválido ao criar setor');
    } catch (error) {
      console.error('[SectorsRepository] Erro ao criar setor:', error);
      throw error;
    }
  },

  async update(id: string, sector: Partial<Sector>): Promise<Sector> {
    try {
      const response = await apiClient.put(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return { id, ...sector } as Sector;
    } catch (error) {
      console.error('[SectorsRepository] Erro ao atualizar setor:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`);
      return { success: true };
    } catch (error) {
      console.error('[SectorsRepository] Erro crítico ao excluir setor:', error);
      throw error;
    }
  }
};
