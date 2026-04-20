import { apiClient } from '../../shared/api/client';
import { ENDPOINTS } from '../../shared/api/endpoints';

export interface Sector {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export const SectorService = {
  getSectors: async (): Promise<Sector[]> => {
    try {
      const response = await apiClient.get(ENDPOINTS.SECTORS.BASE);
      const data = response.data;
      
      console.log('API Sectors Response:', data);

      if (Array.isArray(data)) return data;
      if (data.sectors && Array.isArray(data.sectors)) return data.sectors;
      
      return [];
    } catch (error) {
      console.error('Error fetching sectors:', error);
      throw error;
    }
  },
  createSector: async (sector: Omit<Sector, 'id'>): Promise<Sector> => {
    const { data } = await apiClient.post(ENDPOINTS.SECTORS.BASE, sector);
    return data;
  },
  updateSector: async (id: string, sector: Partial<Sector>): Promise<Sector> => {
    const { data } = await apiClient.patch(`${ENDPOINTS.SECTORS.BASE}/${id}`, sector);
    return data;
  },
  deleteSector: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.SECTORS.BASE}/${id}`);
  }
};
