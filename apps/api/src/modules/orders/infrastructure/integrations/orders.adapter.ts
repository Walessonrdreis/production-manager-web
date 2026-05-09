import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class OrdersAdapter {
  static async fetchFromExternalAPI(page: number = 1, pageSize: number = 200) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/admin/orders`;
      let allOrders: any[] = [];
      let currentPage = page;
      let hasMore = true;
      const MAX_PAGES = 50; // Prevent infinite loop

      while (hasMore && currentPage <= MAX_PAGES) {
        const response = await externalClient.get(targetUrl, { 
          params: { 
            page: currentPage, 
            pageSize,
            _t: new Date().getTime() // Cache buster
          },
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const responseData = response.data || {};
        const orders = responseData.data?.orders || responseData.orders || [];
        
        if (orders.length > 0) {
          allOrders = [...allOrders, ...orders];
        }

        // If returned orders are less than pageSize, we hit the last page
        if (orders.length < pageSize || !orders || orders.length === 0) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }
      return allOrders;
    } catch (err: any) {
      throw new AppError(`Failed to fetch orders: ${err.message}`, 502);
    }
  }

  static async fetchOrdersList(params?: any) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/admin/orders`;
      const response = await externalClient.get(targetUrl, { 
        params: {
          ...params,
          _t: new Date().getTime()
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response.data?.data?.orders || response.data?.orders || response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch orders list: ${err.message}`, 502);
    }
  }
}
