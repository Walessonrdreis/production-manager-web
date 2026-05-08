import { describe, it, expect } from 'vitest';
import { OrderLogic } from '../OrderLogic';
import { Order } from '../OrderNormalizer';

describe('OrderLogic', () => {
  const mockOrders: Partial<Order>[] = [
    { id: '1', orderNumber: '100', customerName: 'João', status: 'Ativo', etapa: '20' },
    { id: '2', orderNumber: '101', customerName: 'Maria', status: 'Ativo', etapa: '10' }
  ];

  describe('filterOrders', () => {
    it('should filter by order number', () => {
      const result = OrderLogic.filterOrders(mockOrders as Order[], '101');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should filter by customer name', () => {
      const result = OrderLogic.filterOrders(mockOrders as Order[], 'joao');
      expect(result).toHaveLength(1);
    });
  });

  describe('groupByEtapa', () => {
    it('should group orders by etapa', () => {
      const result = OrderLogic.groupByEtapa(mockOrders as Order[]);
      expect(result['20']).toHaveLength(1);
      expect(result['10']).toHaveLength(1);
    });
  });
});
