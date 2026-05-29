import { apiClient } from '../../../services/api/client';
import { ProductionOrderV2 } from '../model/types';

export const productionOrdersApi = {
  // Chamada simulada para os novos endpoints FSD conectando ao banco relacional:
  getOpenedOrders: async (): Promise<ProductionOrderV2[]> => {
    // In future: return (await apiClient.get('/v2/production-orders?status=OPENED')).data;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1001', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'OPENED', item: 'Mesa de Jantar', quantity: 10 },
          { id: '1002', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(), status: 'OPENED', item: 'Cadeira de Escritório', quantity: 50 },
          { id: '1003', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString(), status: 'REVIEW', item: 'Armário de Parede', quantity: 5 },
          { id: '1004', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'OPENED', item: 'Cadeira de Escritório - Ergonomica', quantity: 15 },
          { id: '1005', createdAt: new Date(Date.now() - 43200000).toISOString(), updatedAt: new Date().toISOString(), status: 'OPENED', item: 'Mesa de Centro', quantity: 30 },
          { id: '1006', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: new Date().toISOString(), status: 'CANCELLED', item: 'Estante de Livros', quantity: 8 },
        ] as ProductionOrderV2[]);
      }, 500);
    });
  },
};

