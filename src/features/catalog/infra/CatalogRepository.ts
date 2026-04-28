import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

export const CatalogRepository = {
  async getProductsPage(page: number, registros_por_pagina: number = 100) {
    return apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
      params: { 
        pagina: page, 
        registros_por_pagina,
        page: page,
        limit: registros_por_pagina
      }
    });
  },

  async syncWithOmie() {
    return apiClient.post(ENDPOINTS.PRODUCTS.SYNC, {});
  }
};
