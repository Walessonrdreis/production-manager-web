import { externalClient } from '../../../../shared/integrations/external/external.client.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class SectorsAdapter {
  static async fetchFromExternalAPI() {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/sectors`;
      const response = await externalClient.get(targetUrl);
      const data = response.data;
      return data?.sectors || data?.data?.sectors || data?.data || data || [];
    } catch (err: any) {
      throw new AppError(`Failed to fetch sectors: ${err.message}`, err.response?.status || 500);
    }
  }

  static async createSector(sector: any) {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/sectors`;
      const response = await externalClient.post(targetUrl, sector);
      return response.data?.data || response.data?.sector || response.data;
    } catch (err: any) {
      throw new AppError(`Failed to create sector: ${err.message}`, err.response?.status || 500);
    }
  }

  static async updateSector(id: string, sector: any) {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/sectors/${id}`;
      const response = await externalClient.put(targetUrl, sector);
      return response.data?.data || response.data?.sector || response.data;
    } catch (err: any) {
      throw new AppError(`Failed to update sector: ${err.message}`, err.response?.status || 500);
    }
  }

  static async deleteSector(id: string) {
    try {
      const targetUrl = `${process.env.VITE_API_BASE_URL || 'https://production-manager-api.onrender.com/v1'}/admin/sectors/${id}`;
      await externalClient.delete(targetUrl);
      return { success: true };
    } catch (err: any) {
      throw new AppError(`Failed to delete sector: ${err.message}`, err.response?.status || 500);
    }
  }
}
