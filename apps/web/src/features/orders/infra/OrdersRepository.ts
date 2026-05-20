import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const OrdersRepository = {
  async syncWithOmie() {
    try {
      const { data } = await apiClient.post(ENDPOINTS.PRODUCTION_CONTROL.SYNC_STAGE20, {});
      return data;
    } catch (apiError) {
      console.error('[OrdersRepository] Failed to sync orders:', apiError);
      throw apiError;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.BASE);
      if (response.data) {
        let orders = [];
        if (Array.isArray(response.data)) {
          orders = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          orders = response.data.data;
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          orders = response.data.orders;
        }
        
        return { data: { data: orders } };
      }
    } catch (apiError) {
      console.error('[OrdersRepository] Failed to fetch from API:', apiError);
    }
    
    return { data: { data: [] } };
  }
};
