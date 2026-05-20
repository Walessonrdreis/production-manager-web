import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const ProductionRepository = {
  async getStage20Totals(): Promise<any> {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTION_CONTROL.STAGE20_TOTALS, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404
      });
      if (response.status === 404) return { data: [] };
      return response.data; 
    } catch (err) {
      console.error('[ProductionRepository] Falha ao buscar stage20 totals na api', err);
      return { data: [] };
    }
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.PRODUCTION_CONTROL.SYNC_STAGE20, {});
    return data;
  }
};
