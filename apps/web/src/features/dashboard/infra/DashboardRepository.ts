import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../../types/api';
import { DashboardLogic } from '../domain/DashboardLogic';

export const DashboardRepository = {
  async getStage20Totals(): Promise<DashboardTotalsResponse> {
    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTION_CONTROL.STAGE20_TOTALS);
      const rawData = response.data;
      return {
        data: rawData.data || [],
        totalItems: rawData.totalItems || 0,
        lastUpdate: new Date().toISOString()
      };
    } catch (err) {
      console.error('[DashboardRepository] Falha ao buscar stage20 totals na api', err);
      return { data: [], totalItems: 0, lastUpdate: new Date().toISOString() };
    }
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.PRODUCTION_CONTROL.SYNC_STAGE20, {});
    return data;
  }
};
