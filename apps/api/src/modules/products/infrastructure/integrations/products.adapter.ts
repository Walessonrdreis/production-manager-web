import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class ProductsAdapter {
  static async fetchFromExternalAPI(limit: number = 1000) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/products`;
      const response = await externalClient.get(targetUrl, { 
        params: { limit }
      });
      return response.data.data || [];
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
      const response = await externalClient.get(targetUrl);
      return response.data;
    } catch (err: any) {
      throw new AppError(`Failed to fetch products list: ${err.message}`, 502);
    }
  }
}
