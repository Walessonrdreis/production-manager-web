import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { FirebaseOrderRepository } from './FirebaseOrderRepository';

export const OrdersRepository = {
  async syncWithOmie() {
    try {
      const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
      if (data && data.data && Array.isArray(data.data)) {
        await FirebaseOrderRepository.saveMany(data.data.map((o: any) => ({ ...o, id: o.id || o.omieCode || o.codigo_pedido })));
      }
      return data;
    } catch (apiError) {
      console.warn('[OrdersRepository] Failed to sync orders:', apiError);
      throw apiError;
    }
  },

  async getAll() {
    // Try to get from Firebase first as per user request
    const cachedResponse = await FirebaseOrderRepository.getAll();
    if (cachedResponse.success && cachedResponse.data && cachedResponse.data.length > 0) {
      return { data: { data: cachedResponse.data } };
    }

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

        if (orders.length > 0) {
          FirebaseOrderRepository.saveMany(orders.map(o => ({ ...o, id: o.id || o.omieCode || o.codigo_pedido })))
            .catch(err => console.log('Warn: Failed to save orders to Firebase', err));
        }

        return response;
      }
    } catch (apiError) {
      console.warn('[OrdersRepository] Failed to fetch from API:', apiError);
    }
    
    return { data: { data: [] } };
  }
};
