import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { SavedProduct } from '../../../db/models';

export const ApiMyProductsRepository = {
  async getAll(): Promise<SavedProduct[]> {
    try {
      const response = await apiClient.get<{ success: boolean, data?: SavedProduct[] }>(ENDPOINTS.STOCKS.BASE);
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // If the backend returns directly an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (e) {
      console.warn('[ApiMyProductsRepository] fallback or failure to load', e);
      return [];
    }
  },
  
  async save(product: SavedProduct): Promise<void> {
    try {
      if (!product.id) return;
      await apiClient.post(`${ENDPOINTS.STOCKS.BASE}/${product.id}`, {
        ...product,
        savedAt: Date.now()
      });
    } catch (e) {
      console.warn('[ApiMyProductsRepository] failed to save', e);
      throw e;
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.STOCKS.BASE}/${id}`);
    } catch (e) {
      console.warn('[ApiMyProductsRepository] failed to delete', e);
      throw e;
    }
  },
  
  async update(id: string, updates: Partial<SavedProduct>): Promise<void> {
    try {
      // Typically put or patch, let's use put as per current express routes
      await apiClient.put(`${ENDPOINTS.STOCKS.BASE}/${id}`, updates);
    } catch (e) {
      console.warn('[ApiMyProductsRepository] failed to update', e);
      throw e;
    }
  },

  async clear(): Promise<void> {
    try {
      // Clear all is not supported natively by a single endpoint in the backend at this time.
      // We will fetch all and delete them one by one.
      const all = await this.getAll();
      await Promise.all(all.map(p => {
        if (p.id) return this.delete(p.id);
        return Promise.resolve();
      }));
    } catch (e) {
      console.warn('[ApiMyProductsRepository] failed to clear', e);
      throw e;
    }
  }
};
