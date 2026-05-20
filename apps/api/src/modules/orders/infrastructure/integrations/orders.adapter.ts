import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class OrdersAdapter {
  static async fetchFromExternalAPI(page: number = 1, pageSize: number = 200) {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/orders/stage20/enriched`;
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
        const orders = Array.isArray(responseData) ? responseData : (responseData.enrichedOrders || responseData.data?.orders || responseData.orders || responseData.data || []);
        
        if (orders.length > 0) {
          allOrders = [...allOrders, ...orders];
        }

        // If returned orders are less than pageSize, we hit the last page
        if (orders.length < pageSize || !orders || orders.length === 0) {
          hasMore = false;
        } else {
          currentPage++;
          // Add 1s delay to respect rate limit (status 429) upstream
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      return allOrders;
    } catch (err: any) {
      throw new AppError(`Failed to fetch orders: ${err.message}`, err.response?.status || 500);
    }
  }

  static async fetchOrdersList(params?: any) {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/orders/stage20/enriched`;
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
      return response.data?.enrichedOrders || response.data?.data?.orders || response.data?.orders || response.data?.data || response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch orders list: ${err.message}`, err.response?.status || 500);
    }
  }
}
