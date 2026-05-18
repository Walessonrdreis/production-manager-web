import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class ProductionAdapter {
  static async fetchProduced() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/produced`;
      const response = await externalClient.get(targetUrl);
      return response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch produced data: ${err.message}`, err.response?.status || 500);
    }
  }

  static async fetchSchedules() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/schedules`;
      const response = await externalClient.get(targetUrl);
      return response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch schedules data: ${err.message}`, err.response?.status || 500);
    }
  }
}
