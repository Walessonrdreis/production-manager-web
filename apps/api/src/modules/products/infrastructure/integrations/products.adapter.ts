import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class ProductsAdapter {
  static async fetchFromExternalAPI(limit: number = 1000) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/products`;
      const firstResponse = await externalClient.get(targetUrl, { 
        params: { page: 1, _t: new Date().getTime() },
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const { data: firstPageData, meta } = firstResponse.data;
      
      let allProducts = [...(firstPageData || [])];
      
      if (meta && meta.pageSize > 0 && meta.total > meta.pageSize) {
        const totalPages = Math.ceil(meta.total / meta.pageSize);
        for (let i = 2; i <= totalPages; i += 5) {
          const chunk = [];
          for (let j = i; j < i + 5 && j <= totalPages; j++) {
            chunk.push(externalClient.get(targetUrl, { 
              params: { page: j, _t: new Date().getTime() },
              headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            }));
          }
          const responses = await Promise.all(chunk);
          for (const res of responses) {
            if (res.data && res.data.data) {
              allProducts = [...allProducts, ...res.data.data];
            }
          }
        }
      }

      return allProducts;
    } catch (err: any) {
      throw new AppError(`Failed to fetch products: ${err.message}`, 502);
    }
  }

  static async fetchStockRefresh() {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/admin/omie/products/stock/refresh`;
      const response = await externalClient.post(targetUrl);
      return response.data;
    } catch (err: any) {
      throw new AppError(`Failed to refresh stock: ${err.message}`, 502);
    }
  }

  static async fetchAdminProducts() {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/admin/products`;
      const response = await externalClient.get(targetUrl);
      return response.data;
    } catch (err: any) {
      throw new AppError(`Failed to fetch admin products: ${err.message}`, 502);
    }
  }

  static async fetchList() {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/products`;
      const firstResponse = await externalClient.get(targetUrl, { 
        params: { page: 1, _t: new Date().getTime() },
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const { data: firstPageData, meta } = firstResponse.data;
      
      let allProducts = [...(firstPageData || [])];
      
      if (meta && meta.pageSize > 0 && meta.total > meta.pageSize) {
        const totalPages = Math.ceil(meta.total / meta.pageSize);
        for (let i = 2; i <= totalPages; i += 5) {
          const chunk = [];
          for (let j = i; j < i + 5 && j <= totalPages; j++) {
            chunk.push(externalClient.get(targetUrl, { 
              params: { page: j, _t: new Date().getTime() },
              headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            }));
          }
          const responses = await Promise.all(chunk);
          for (const res of responses) {
            if (res.data && res.data.data) {
              allProducts = [...allProducts, ...res.data.data];
            }
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
      throw new AppError(`Failed to fetch products list: ${err.message}`, 502);
    }
  }
}
