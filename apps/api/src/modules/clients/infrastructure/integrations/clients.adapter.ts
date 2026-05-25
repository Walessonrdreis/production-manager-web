import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class ClientsAdapter {
  static async fetchFromExternalAPI(page: number = 1, pageSize: number = 5000) {
    try {
      const baseUrl = process.env.API1_BASE_URL || 'https://production-manager-api.onrender.com';
      const targetUrl = `${baseUrl}/v1/clients`;
      let allClients: any[] = [];
      let currentPage = page;
      let hasMore = true;
      const MAX_PAGES = 5; 

      while (hasMore && currentPage <= MAX_PAGES) {
        const response = await externalClient.get(targetUrl, { 
          timeout: 30000, 
          params: { page: currentPage, pageSize, _t: new Date().getTime() },
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const responseData = response.data || {};
        const clients = responseData.data || responseData.clients || [];
        
        if (clients.length > 0) {
          allClients = [...allClients, ...clients];
        }

        if (clients.length < pageSize || !clients || clients.length === 0) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }
      return allClients;
    } catch (err: any) {
      console.error(`[ClientsAdapter] Failed to fetch clients from external API. It may not exist. ${err.message}`);
      return []; // suppress error
    }
  }

  static async fetchClientsList(params?: any) {
    try {
      const baseUrl = process.env.API1_BASE_URL || 'https://production-manager-api.onrender.com';
      const targetUrl = `${baseUrl}/v1/clients`;
      const response = await externalClient.get(targetUrl, { params });
      return response.data?.data || response.data || [];
    } catch (err: any) {
      console.error(`[ClientsAdapter] Failed to fetch clients list. Endpoint may not exist on legacy api. ${err.message}`);
      return []; // suppress error and return empty array
    }
  }
}
