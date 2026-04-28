import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const OrdersRepository = {
  async getAll() {
    return apiClient.get(ENDPOINTS.ORDERS.BASE);
  }
};
