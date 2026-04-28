import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { Sector } from '../../../types/api';

export const SectorsRepository = {
  async getAll(): Promise<Sector[]> {
    const { data } = await apiClient.get(ENDPOINTS.SECTORS.BASE);
    
    if (Array.isArray(data)) return data;
    if (data.sectors && Array.isArray(data.sectors)) return data.sectors;
    
    return [];
  },

  async create(sector: Omit<Sector, 'id'>) {
    const { data } = await apiClient.post(ENDPOINTS.SECTORS.BASE, sector);
    return data;
  },

  async update(id: string, sector: Partial<Sector>) {
    const { data } = await apiClient.patch(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector);
    return data;
  },

  async delete(id: string) {
    await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`);
  }
};
