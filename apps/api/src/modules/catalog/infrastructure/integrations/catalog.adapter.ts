import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class ProductsAdapter {
  static async fetchFromExternalAPI(limit: number = 1000) {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/products`;
      const firstResponse = await externalClient.get(targetUrl, { 
        params: { page: 1, _t: new Date().getTime() },
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const { data: firstPageData, meta } = firstResponse.data;
      
      let allProducts = [...(firstPageData || [])];
      
      if (meta && meta.pageSize > 0 && meta.total > meta.pageSize) {
        const totalPages = Math.ceil(meta.total / meta.pageSize);
        for (let i = 2; i <= totalPages; i++) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Respect rate limits
            const res = await externalClient.get(targetUrl, { 
              params: { page: i, _t: new Date().getTime() },
              headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });
            if (res.data && res.data.data) {
              allProducts = [...allProducts, ...res.data.data];
            }
          } catch (err: any) {
             console.warn('[CATALOG API fetchFromExternalAPI] Partial fetch failure on page', i, ':', err.message);
          }
        }
      }

      return allProducts;
    } catch (err: any) {
      throw new AppError(`Failed to fetch catalog products: ${err.message}`, err.response?.status || 500);
    }
  }

  static async fetchStockRefresh() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/omie/products/stock/refresh`;
      const response = await externalClient.post(targetUrl, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (err: any) {
      throw new AppError(`Failed to refresh catalog stock: ${err.message}`, err.response?.status || 500);
    }
  }

  static async fetchAdminProducts() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/products`;
      const response = await externalClient.get(targetUrl);
      return response.data;
    } catch (err: any) {
      throw new AppError(`Failed to fetch admin catalog products: ${err.message}`, err.response?.status || 500);
    }
  }

  static async fetchList() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/products`;
      const firstResponse = await externalClient.get(targetUrl, { 
        params: { page: 1, _t: new Date().getTime() },
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const { data: firstPageData, meta } = firstResponse.data;
      
      let allProducts = [...(firstPageData || [])];
      
      if (meta && meta.pageSize > 0 && meta.total > meta.pageSize) {
        const totalPages = Math.ceil(meta.total / meta.pageSize);
        for (let i = 2; i <= totalPages; i++) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Respect rate limits
            const res = await externalClient.get(targetUrl, { 
              params: { page: i, _t: new Date().getTime() },
              headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });
            if (res.data && res.data.data) {
              allProducts = [...allProducts, ...res.data.data];
            }
          } catch (err: any) {
             console.warn('[CATALOG API fetchList] Partial fetch failure on page', i, ':', err.message);
          }
        }
      }

      return {
        data: allProducts,
        meta: {
          page: 1,
          pageSize: allProducts.length,
          total: allProducts.length
        }
      };
    } catch (err: any) {
      throw new AppError(`Failed to fetch catalog products list: ${err.message}`, err.response?.status || 500);
    }
  }
}
