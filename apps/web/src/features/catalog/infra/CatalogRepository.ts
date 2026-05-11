import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const CatalogRepository = {
  async getProductsPage(page: number, registros_por_pagina: number = 100) {
    try {
      const response = await apiClient.get(ENDPOINTS.CATALOG.LIST, {
        params: { 
          pagina: page, 
          registros_por_pagina,
          page: page,
          limit: registros_por_pagina
        }
      });
      
      if (response.data) {
        return response;
      }
    } catch (apiError) {
      console.warn('[CatalogRepository] Failed to fetch from API:', apiError);
    }
    
    return { data: { data: [] } };
  },

  async syncWithOmie() {
    const response = await apiClient.post(ENDPOINTS.CATALOG.SYNC, {});
    return response;
  },

  async syncStockWithOmie() {
    return apiClient.post(ENDPOINTS.CATALOG.SYNC_STOCK, {}, { timeout: 120000 });
  }
};
