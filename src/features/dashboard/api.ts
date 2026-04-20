import axios from 'axios';
import { apiClient } from '../../shared/api/client';
import { ENDPOINTS } from '../../shared/api/endpoints';

export interface Stage20Total {
  description: string;
  totalQuantity: number;
}

export interface DashboardTotalsResponse {
  data: Stage20Total[];
  totalItems?: number;
  lastUpdate?: string;
}

export const DashboardService = {
  getStage20Totals: async (): Promise<DashboardTotalsResponse> => {
    try {
      // O apiClient já está configurado para usar o proxy local '/api/proxy'
      const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
      const rawData = response.data;
      
      // Verificação de segurança: se a API retornar HTML (string começando com <), houve erro no proxy/roteamento
      if (typeof rawData === 'string' && rawData.trim().startsWith('<!doctype')) {
        console.error('ERRO CRÍTICO: O proxy retornou HTML em vez de JSON. Verifique as rotas do servidor.');
        throw new Error('A API retornou um formato inesperado (HTML). Verifique o console do servidor.');
      }
      const products = Array.isArray(rawData) ? rawData : (rawData.data || []);
      const totalUnits = products.reduce((acc: number, curr: any) => acc + (curr.totalQuantity || 0), 0);

      return {
        data: products,
        totalItems: totalUnits,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching stage 20 totals:', error);
      throw error;
    }
  },
  syncStage20: async (): Promise<{ message: string; count: number }> => {
    const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20);
    return data;
  }
};
