import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class PlanningAdapter {
  static async fetchFromExternalAPI() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/planning`;
      const response = await externalClient.get(targetUrl);
      return response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch planning data: ${err.message}`, err.response?.status || 500);
    }
  }
}
