import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { FirebaseOrderRepository } from './FirebaseOrderRepository';

export const OrdersRepository = {
  async syncWithOmie() {
    try {
      const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
      // We don't need to manually push to Firebase here anymore because our backend API
      // automatically saves to Firebase Admin on /sync! 
      return data;
    } catch (apiError) {
      console.warn('[OrdersRepository] Failed to sync orders:', apiError);
      throw apiError;
    }
  },

  async getAll() {
    // 100% reliant on Firebase as per architecture plan!
    const cachedResponse = await FirebaseOrderRepository.getAll();
    if (cachedResponse.success && cachedResponse.data) {
      return { data: { data: cachedResponse.data } };
    }

    // Fallback just in case Firebase is empty, though it shouldn't be since the background job hydrates it
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
