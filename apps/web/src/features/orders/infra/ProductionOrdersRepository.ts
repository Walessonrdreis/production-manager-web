import { apiClient } from '../../../services/api/client';
import { IProductionOrderRepository } from '../domain/IProductionOrderRepository';
import { ProductionOrder } from '../domain/ProductionOrder';

export const ProductionOrdersRepository: IProductionOrderRepository = {
  async getAll() {
    try {
      const response = await apiClient.get<ProductionOrder[]>('/production-orders');
      const data = (response as any).data !== undefined ? (response as any).data : response;
      return { success: true, data: data as ProductionOrder[] };
    } catch (error) {
      console.error('Failed to fetch from API', error);
      return { success: false, error: (error as Error).message };
    }
  },

  async getById(id: string) {
    try {
      const response = await apiClient.get<ProductionOrder>(`/production-orders/${id}`);
      const data = (response as any).data !== undefined ? (response as any).data : response;
      return { success: true, data: data as ProductionOrder };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  async save(order: ProductionOrder) {
    try {
      const response = await apiClient.post<ProductionOrder>('/production-orders', order);
      const data = (response as any).data !== undefined ? (response as any).data : response;
      return { success: true, data: data as ProductionOrder };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  async update(id: string, data: Partial<ProductionOrder>) {
    try {
      const response = await apiClient.patch<ProductionOrder>(`/production-orders/${id}`, data);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  async delete(id: string) {
    try {
      await apiClient.delete(`/production-orders/${id}`);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
};
