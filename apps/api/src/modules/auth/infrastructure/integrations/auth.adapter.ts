import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class AuthAdapter {
  static async login(data?: any) {
    try {
      const targetUrl = `https://production-manager-api.onrender.com/v1/auth/login`;
      const response = await externalClient.post(targetUrl, data);
      return response.data;
    } catch (err: any) {
      throw new AppError(`Failed to login: ${err.message}`, 502);
    }
  }
}
