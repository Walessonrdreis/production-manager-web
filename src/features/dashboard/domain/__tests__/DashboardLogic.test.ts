import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DashboardLogic } from '../DashboardLogic';

describe('DashboardLogic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-29T17:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('aggregateStage20Totals', () => {
    it('should aggregate totals from an array', () => {
      const rawData = [
        { productCode: '1', totalQuantity: 10 },
        { productCode: '2', totalQuantity: 5 }
      ];

      const result = DashboardLogic.aggregateStage20Totals(rawData);

      expect(result.totalItems).toBe(15);
      expect(result.data).toHaveLength(2);
      expect(result.lastUpdate).toBe('2026-04-29T17:00:00.000Z');
    });

    it('should aggregate totals from an object with data property', () => {
      const rawData = {
        data: [
          { productCode: 'A', totalQuantity: 100 }
        ]
      };

      const result = DashboardLogic.aggregateStage20Totals(rawData);

      expect(result.totalItems).toBe(100);
      expect(result.data).toHaveLength(1);
    });

    it('should handle empty or null data', () => {
      const result = DashboardLogic.aggregateStage20Totals({});
      expect(result.totalItems).toBe(0);
      expect(result.data).toEqual([]);
    });

    it('should handle string quantities by converting them to number', () => {
      const rawData = [
        { totalQuantity: '10' },
        { totalQuantity: '20' }
      ];
      const result = DashboardLogic.aggregateStage20Totals(rawData);
      expect(result.totalItems).toBe(30);
    });
  });

  describe('calculateProducedQuantity', () => {
    it('should sum quantities for a matching description', () => {
      const records: any[] = [
        { description: 'P1', quantity: 5 },
        { description: 'P1', quantity: 3 },
        { description: 'P2', quantity: 10 }
      ];
      expect(DashboardLogic.calculateProducedQuantity(records, 'P1')).toBe(8);
    });

    it('should return 0 if no records match', () => {
      expect(DashboardLogic.calculateProducedQuantity([], 'P1')).toBe(0);
    });
  });

  describe('calculateTotalProduced', () => {
    it('should sum all quantities', () => {
      const records: any[] = [{ quantity: 10 }, { quantity: 20 }];
      expect(DashboardLogic.calculateTotalProduced(records)).toBe(30);
    });
  });

  describe('filterOrdersByProduct', () => {
    it('should filter and map orders correctly', () => {
      const orders: any[] = [
        { items: [{ description: 'P1', quantity: 2 }] },
        { items: [{ description: 'P2', quantity: 5 }] }
      ];
      const result = DashboardLogic.filterOrdersByProduct(orders, 'P1');
      expect(result).toHaveLength(1);
      expect(result[0].itemQuantity).toBe(2);
    });
  });

  describe('generateProducedId', () => {
    it('should generate a predictable string', () => {
      expect(DashboardLogic.generateProducedId('123', 'Prod')).toBe('order-123-Prod');
    });
  });
});
