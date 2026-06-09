import { apiClient } from '../../../services/api/client';
import { ProductionOrderV2 } from '../model/types';

// Estado em memória compartilhado para a sessão de Mock.
let memoryOrders: ProductionOrderV2[] = [
  { 
    id: '1001', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(), 
    expectedCompletionDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'OPENED', 
    item: 'Mesa de Jantar', 
    quantity: 10,
    sector: 'Embalagem',
    batch: 'LT-2026-05',
    bom: [
      { id: 'b1', productName: 'Tampo de Madeira Mdf 15mm', quantity: 1, unit: 'UN' },
      { id: 'b2', productName: 'Pé de Madeira Maçiça', quantity: 4, unit: 'UN' },
      { id: 'b3', productName: 'Parafusos 3x16', quantity: 16, unit: 'UN' }
    ]
  },
  { 
    id: '1002', 
    createdAt: new Date(Date.now() - 86400000).toISOString(), 
    updatedAt: new Date().toISOString(), 
    expectedCompletionDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'OPENED', 
    item: 'Cadeira de Escritório', 
    quantity: 50,
    sector: 'Tecelagem',
    batch: 'LT-2026-06',
    bom: [
      { id: 'b4', productName: 'Assento Estofado', quantity: 1, unit: 'UN' },
      { id: 'b5', productName: 'Base Estrela com Rodízios', quantity: 1, unit: 'UN' },
    ]
  },
  { id: '1003', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString(), status: 'REVIEW', item: 'Armário de Parede', quantity: 5, sector: 'Corte', batch: 'LT-01' },
  { id: '1004', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'OPENED', item: 'Cadeira de Escritório - Ergonomica', quantity: 15, sector: 'Montagem', batch: 'LT-02', bom: [] },
  { id: '1005', createdAt: new Date(Date.now() - 43200000).toISOString(), updatedAt: new Date().toISOString(), status: 'OPENED', item: 'Mesa de Centro', quantity: 30, sector: 'Pintura' },
  { id: '1006', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: new Date().toISOString(), status: 'CANCELLED', item: 'Estante de Livros', quantity: 8, sector: 'Limpeza' },
];

export const productionOrdersApi = {
  // Chamada simulada para os novos endpoints FSD conectando ao banco relacional:
  getOpenedOrders: async (): Promise<ProductionOrderV2[]> => {
    // In future: return (await apiClient.get('/v2/production-orders?status=OPENED')).data;
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ordenando do mais recente para o mais antigo para a UI ser consistente
        const sorted = [...memoryOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(sorted.filter(o => o.status !== 'HISTORY'));
      }, 500);
    });
  },

  createOrder: async (payload: { items: { productId: string; quantity: number }[]; notes?: string; batch?: string; expectedCompletionDate?: string; sector?: string; productName?: string; createdAt?: string }): Promise<ProductionOrderV2> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulação de validação
        const productId = payload.items[0].productId;
        const idLastChar = productId.toString().slice(-1);

        // Regras Impeditivas
        if (idLastChar === '1') {
          return reject(new Error('IMPENDING_BOM: O produto selecionado não possui estrutura técnica (BOM) cadastrada. A Ordem não pode ser gerada.'));
        } 
        
        if (idLastChar === '2') {
          return reject(new Error('IMPENDING_COST: Um ou mais insumos da estrutura deste produto não possuem preço de custo cadastrado. Atualize o estoque antes de gerar a OP.'));
        }

        const newOrder: ProductionOrderV2 = {
          id: `200${memoryOrders.length + 1}`,
          createdAt: payload.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'OPENED',
          item: payload.productName || 'Novo Produto',
          quantity: payload.items[0].quantity,
          batch: payload.batch || `LT-${new Date().getFullYear()}`,
          sector: payload.sector || 'Temperagem',
          expectedCompletionDate: payload.expectedCompletionDate || new Date().toISOString(),
        };

        memoryOrders.push(newOrder);
        resolve(newOrder);
      }, 800);
    });
  },

  updateOrder: async (id: string, payload: Partial<ProductionOrderV2>): Promise<ProductionOrderV2> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = memoryOrders.findIndex(o => o.id === id);
        if (index === -1) return reject(new Error('Order not found'));
        
        memoryOrders[index] = { 
          ...memoryOrders[index], 
          ...payload, 
          updatedAt: new Date().toISOString() 
        };
        
        resolve(memoryOrders[index]);
      }, 500);
    });
  },

  deleteOrder: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        memoryOrders = memoryOrders.filter(o => o.id !== id);
        resolve();
      }, 500);
    });
  }
};

