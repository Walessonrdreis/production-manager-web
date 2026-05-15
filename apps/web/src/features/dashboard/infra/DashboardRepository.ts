import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../../types/api';
import { DashboardLogic } from '../domain/DashboardLogic';

export const DashboardRepository = {
  async getStage20Totals(): Promise<DashboardTotalsResponse> {
    try {
      const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
      return DashboardLogic.aggregateStage20Totals(response.data);
    } catch (err) {
      console.error('[DashboardRepository] Falha ao buscar stage20 totals na api', err);
      return { totalAulas: 0, totalPecas: 0, totalArea: 0, totalWeight: 0, items: [] } as any;
    }
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
    return data;
  }
};
