import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class DashboardAdapter {
  static async fetchStage20Totals() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/orders/stage20/totals`;
      const response = await externalClient.get(targetUrl);
      return response.data || {};
    } catch (err: any) {
      throw new AppError(`Failed to fetch stage 20 totals: ${err.message}`, err.response?.status || 500);
    }
  }
}
