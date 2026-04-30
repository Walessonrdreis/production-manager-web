import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../../types/api';
import { DashboardLogic } from '../domain/DashboardLogic';

export const DashboardRepository = {
  async getStage20Totals(): Promise<DashboardTotalsResponse> {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
    return DashboardLogic.aggregateStage20Totals(response.data);
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
    return data;
  }
};
