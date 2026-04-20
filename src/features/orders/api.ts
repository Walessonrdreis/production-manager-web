import { apiClient } from '../../shared/api/client';
import { ENDPOINTS } from '../../shared/api/endpoints';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: Array<{
    productId: string;
    productCode: string;
    description: string;
    quantity: number;
    family: string;
  }>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const OrderService = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get(ENDPOINTS.ORDERS.BASE);
      const data = response.data;
      
      console.log('API Orders Response:', data);

      if (Array.isArray(data)) return data;
      if (data.records && Array.isArray(data.records)) return data.records;
      if (data.orders && Array.isArray(data.orders)) return data.orders;
      
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get(`${ENDPOINTS.ORDERS.BASE}/${id}`);
    return data;
  }
};
