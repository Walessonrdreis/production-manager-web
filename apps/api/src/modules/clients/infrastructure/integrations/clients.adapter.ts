import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class ClientsAdapter {
  static async fetchFromExternalAPI(page: number = 1, pageSize: number = 5000) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/clients`;
      const response = await externalClient.get(targetUrl, { 
        timeout: 120000, 
        params: { page, pageSize }
      });
      const responseData = response.data || {};
      return responseData.data || responseData.clients || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch clients: ${err.message}`, 502);
    }
  }
}
