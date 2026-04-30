import { Order } from './OrderNormalizer';

export const OrderLogic = {
  /**
   * Filtra ordens de venda baseado em busca textual.
   */
  filterOrders(orders: Order[], search: string): Order[] {
    const normalize = (str: string) => 
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const term = normalize(search);
    if (!term) return orders;
    
    return orders.filter(o => 
      normalize(o.orderNumber).includes(term) ||
      normalize(o.customerName).includes(term) ||
      normalize(o.status).includes(term) ||
      normalize(o.etapa).includes(term)
    );
  },

  /**
   * Agrupa ordens por etapa de produção.
   */
  groupByEtapa(orders: Order[]): Record<string, Order[]> {
    return orders.reduce((acc, order) => {
      const etapa = order.etapa || 'Sem Etapa';
      if (!acc[etapa]) acc[etapa] = [];
      acc[etapa].push(order);
      return acc;
    }, {} as Record<string, Order[]>);
  }
};
