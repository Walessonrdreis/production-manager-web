import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';
import { DashboardTotalsResponse } from '../../../types/api';
import { DashboardLogic } from '../domain/DashboardLogic';
import { FirebaseOrderRepository } from '../../orders/infra/FirebaseOrderRepository';

export const DashboardRepository = {
  async getStage20Totals(): Promise<DashboardTotalsResponse> {
    const { data } = await FirebaseOrderRepository.getAll();
    if (data && data.length > 0) {
      return DashboardLogic.aggregateStage20Totals({ data: data });
    }

    try {
      const response = await apiClient.get(ENDPOINTS.DASHBOARD.STAGE20_TOTALS);
      if (response.data && response.data.data) {
        // Salva cache em background
        FirebaseOrderRepository.saveMany(response.data.data.map((o: any) => ({ ...o, id: o.id || o.omieCode || o.codigo_pedido })))
          .catch(err => console.log('Warn: failed to cache stage20 orders', err));
      }
      return DashboardLogic.aggregateStage20Totals(response.data);
    } catch (err) {
      console.warn('[DashboardRepository] Falha ao buscar stage20 totals na api', err);
    }

    return { data: [], totalItems: 0 } as any;
  },

  async syncStage20() {
    const { data } = await apiClient.post(ENDPOINTS.DASHBOARD.SYNC_STAGE20, {});
    
    if (data && data.data && Array.isArray(data.data)) {
        FirebaseOrderRepository.saveMany(data.data.map((o: any) => ({ ...o, id: o.id || o.omieCode || o.codigo_pedido })))
          .catch(err => console.log('Warn: failed to cache stage20 synced orders locally', err));
    }
    
    return data;
  }
};
