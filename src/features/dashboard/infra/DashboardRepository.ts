import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../../types/api';

export const DashboardRepository = {
  async getStage20Totals(): Promise<DashboardTotalsResponse> {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
    const rawData = response.data;
    const products = Array.isArray(rawData) ? rawData : (rawData.data || []);
    const totalUnits = products.reduce((acc: number, curr: any) => acc + (curr.totalQuantity || 0), 0);

    return {
      data: products,
      totalItems: totalUnits,
      lastUpdate: new Date().toISOString()
    };
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
    return data;
  },

  async getProduced() {
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.PRODUCED);
    return Array.isArray(data) ? data : [];
  },

  async addProduced(description: string, quantity: number) {
    return apiClient.post(ENDPOINTS.DASHBOARD.PRODUCED, { description, quantity });
  },

  async removeProduced(id: string) {
    return apiClient.delete(`${ENDPOINTS.DASHBOARD.PRODUCED}/${id}`);
  }
};
