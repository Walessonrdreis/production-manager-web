import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class OrdersAdapter {
  static async fetchFromExternalAPI(page: number = 1, pageSize: number = 500) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/orders`;
      const response = await externalClient.get(targetUrl, { 
        params: { page, pageSize }
      });
      const responseData = response.data || {};
      return responseData.orders || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch orders: ${err.message}`, 502);
    }
  }

  static async fetchOrdersList(params?: any) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/orders`;
      const response = await externalClient.get(targetUrl, { params });
      return response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch orders list: ${err.message}`, 502);
    }
  }
}
