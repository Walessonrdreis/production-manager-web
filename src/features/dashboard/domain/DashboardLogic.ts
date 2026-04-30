import { type DashboardTotalsResponse, type Order } from '../../../types/api';
import { type ProducedRecord } from '../../../db/models';

export const DashboardLogic = {
  /**
   * Agrega os dados crus da API Omie para o formato de exibição do dashboard.
   */
  aggregateStage20Totals(rawData: any): DashboardTotalsResponse {
    const products = Array.isArray(rawData) ? rawData : (rawData.data || []);
    const totalUnits = products.reduce((acc: number, curr: any) => acc + (Number(curr.totalQuantity) || 0), 0);

    return {
      data: products,
      totalItems: totalUnits,
      lastUpdate: new Date().toISOString()
    };
  },

  /**
   * Calcula a quantidade produzida para uma descrição específica.
   */
  calculateProducedQuantity(records: ProducedRecord[], description: string): number {
    return records
      .filter(r => r.description === description)
      .reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  },

  /**
   * Calcula o total geral produzido.
   */
  calculateTotalProduced(records: ProducedRecord[]): number {
    return records.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  },

  /**
   * Filtra ordens que contêm um produto específico e anexa a quantidade desse item.
   */
  filterOrdersByProduct(orders: Order[], description: string) {
    return orders
      .filter(order => 
        order.items.some(item => item.description === description)
      ).map(order => ({
        ...order,
        itemQuantity: order.items.find(item => item.description === description)?.quantity || 0
      }));
  },

  /**
   * Gera um ID determinístico para um registro de produção vinculado a uma ordem.
   */
  generateProducedId(orderId: string, description: string): string {
    return `order-${orderId}-${description}`;
  }
};
