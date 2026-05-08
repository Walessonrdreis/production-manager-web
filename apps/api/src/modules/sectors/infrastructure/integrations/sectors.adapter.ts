import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class SectorsAdapter {
  static async fetchFromExternalAPI() {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/admin/sectors`;
      const response = await externalClient.get(targetUrl);
      return response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch sectors: ${err.message}`, 502);
    }
  }
}
