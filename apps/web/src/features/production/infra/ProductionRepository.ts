import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../../types/api';
import { ProductionLogic } from '../domain/ProductionLogic';
import { FirebaseOrderRepository } from '../../orders/infra/FirebaseOrderRepository';

export const ProductionRepository = {
  async getStage20Totals(): Promise<any> {
    const { data } = await FirebaseOrderRepository.getAll();
    if (data && data.length > 0) {
      return { data: data };
    }

    try {
      const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
      if (response.data && response.data.data) {
        FirebaseOrderRepository.saveMany(response.data.data.map((o: any) => ({ ...o, id: o.id || o.omieCode || o.codigo_pedido })))
          .catch(err => console.log('Warn: failed to cache stage20 orders', err));
      }
      return response.data; 
    } catch (err) {
      console.warn('[ProductionRepository] Falha ao buscar stage20 totals na api', err);
    }
    
    return { data: [] };
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
    
    if (data && data.data && Array.isArray(data.data)) {
        FirebaseOrderRepository.saveMany(data.data.map((o: any) => ({ ...o, id: o.id || o.omieCode || o.codigo_pedido })))
          .catch(err => console.log('Warn: failed to cache stage20 synced orders locally in ProductionRepo', err));
    }
    
    return data;
  }
};
