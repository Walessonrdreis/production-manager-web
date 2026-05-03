import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../../types/api';
import { ProductionLogic } from '../domain/ProductionLogic';

export const ProductionRepository = {
  async getStage20Totals(): Promise<any> {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
    return response.data; 
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
    return data;
  }
};
