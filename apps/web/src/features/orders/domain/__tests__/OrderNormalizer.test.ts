import { describe, it, expect } from 'vitest';
import { normalizeOrder, findOrdersArray } from '../OrderNormalizer';

describe('OrderNormalizer', () => {
  describe('normalizeOrder', () => {
    it('should normalize total values and handle defaults', () => {
      const raw = {
        omieCode: '123',
        numeroPedido: 'ORDER-001',
        cliente: 'Test Customer',
        items: [{ omieItemCode: 'ITEM-1', description: 'Item 1', quantity: 1, unit: 'UN' }],
        cancelado: 'N',
        encerrado: 'N'
      };

      const normalized = normalizeOrder(raw);

      expect(normalized.id).toBe('123');
      expect(normalized.orderNumber).toBe('ORDER-001');
      expect(normalized.customerName).toBe('Test Customer');
      expect(normalized.items).toHaveLength(1);
      expect(normalized.status).toBe('Ativo');
    });

    it('should set status as Cancelado when cancelado is Y', () => {
      const normalized = normalizeOrder({ cancelado: 'Y' });
      expect(normalized.status).toBe('Cancelado');
    });

    it('should set status as Encerrado when encerrado is Y', () => {
      const normalized = normalizeOrder({ encerrado: 'Y' });
      expect(normalized.status).toBe('Encerrado');
    });

    it('should handle missing fields with fallback values', () => {
      const normalized = normalizeOrder({});
      expect(normalized.orderNumber).toBe('N/A');
      expect(normalized.customerName).toBe('Cliente Omie');
      expect(normalized.items).toEqual([]);
      expect(normalized.status).toBe('Ativo');
    });
  });

  describe('findOrdersArray', () => {
    it('should find array in standard omie response structure', () => {
      const response = {
        data: {
          ordens_venda: [
            { numero_pedido: '1' },
            { numero_pedido: '2' }
          ]
        }
      };

      const result = findOrdersArray(response);
      expect(result).toHaveLength(2);
      expect(result?.[0].numero_pedido).toBe('1');
    });

    it('should find nested array in custom structure', () => {
      const response = {
        result: {
          registers: [{}, {}]
        }
      };

      const result = findOrdersArray(response);
      expect(result).toHaveLength(2);
    });

    it('should return null if no array is found within depth limit', () => {
      const response = { a: { b: { c: { d: { e: { f: [] } } } } } };
      expect(findOrdersArray(response)).toBeNull();
    });

    it('should return the object itself if it is already an array', () => {
      const arr = [1, 2, 3];
      expect(findOrdersArray(arr)).toBe(arr);
    });
  });
});
