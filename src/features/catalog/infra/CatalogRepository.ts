import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { FirebaseProductRepository } from '../../products/infra/FirebaseProductRepository';

export const CatalogRepository = {
  async getProductsPage(page: number, registros_por_pagina: number = 100) {
    // Try to get from Firebase first as per user request
    const cachedResponse = await FirebaseProductRepository.getAll();
    if (cachedResponse.success && cachedResponse.data && cachedResponse.data.length > 0) {
      // Retorna em formato compativel com a paginação se possivel, ou apenas todos os produtos
      return { data: { data: cachedResponse.data, meta: { total: cachedResponse.data.length, page: 1 } } };
    }

    try {
      const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
        params: { 
          pagina: page, 
          registros_por_pagina,
          page: page,
          limit: registros_por_pagina
        }
      });
      
      if (response.data) {
        let products = [];
        if (Array.isArray(response.data)) {
          products = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          products = response.data.data;
        } else if (response.data.products && Array.isArray(response.data.products)) {
          products = response.data.products;
        }
        
        if (products.length > 0) {
           FirebaseProductRepository.saveMany(products.map(p => ({ ...p, id: p.id || p.codigo_produto || p.code })))
            .catch(err => console.log('Warn: Failed to save catalog products to Firebase', err));
        }
        return response;
      }
    } catch (apiError) {
      console.warn('[CatalogRepository] Failed to fetch from API:', apiError);
    }
    
    return { data: { data: [] } };
  },

  async syncWithOmie() {
    const response = await apiClient.post(ENDPOINTS.PRODUCTS.SYNC, {});
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const products = response.data.data;
      if (products.length > 0) {
           FirebaseProductRepository.saveMany(products.map((p: any) => ({ ...p, id: p.id || p.codigo_produto || p.code })))
            .catch(err => console.log('Warn: Failed to save synced products to Firebase', err));
      }
    }
    
    return response;
  },

  async syncStockWithOmie() {
    return apiClient.post(ENDPOINTS.PRODUCTS.SYNC_STOCK, {}, { timeout: 60000 });
  }
};
