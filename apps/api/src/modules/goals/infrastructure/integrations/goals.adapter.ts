import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class GoalsAdapter {
  static async fetchFromExternalAPI() {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/admin/goals`;
      const response = await externalClient.get(targetUrl);
      return response.data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch goals data: ${err.message}`, 502);
    }
  }
}
