import { describe, it, expect } from 'vitest';
import { PlanningLogic } from '../PlanningLogic';
import { type PlanningItem } from '../../../../db/models';
import { type Product } from '../../../../types/api';

describe('PlanningLogic', () => {
  describe('calculateAdditions', () => {
    const mockProduct: Product = {
      id: 'P1',
      code: 'P1-CODE',
      description: 'Produto 1',
      unit: 'UN',
      price: 0,
      stock: 0,
      family: ''
    };

    it('should suggest adding a new item when it does not exist', () => {
      const currentItems: PlanningItem[] = [];
      const productsToAdd = [{ product: mockProduct, quantity: 5 }];

      const result = PlanningLogic.calculateAdditions(currentItems, productsToAdd);

      expect(result.toAdd).toHaveLength(1);
      expect(result.toAdd[0]).toMatchObject({
        code: 'P1',
        description: 'Produto 1',
        quantity: 5
      });
      expect(result.toUpdate).toHaveLength(0);
    });

    it('should suggest updating an existing item when codes match', () => {
      const currentItems: PlanningItem[] = [
        { id: 'uuid-1', code: 'P1', description: 'P1', quantity: 2, unit: 'UN', synced: false, updatedAt: '' }
      ];
      const productsToAdd = [{ product: mockProduct, quantity: 3 }];

      const result = PlanningLogic.calculateAdditions(currentItems, productsToAdd);

      expect(result.toAdd).toHaveLength(0);
      expect(result.toUpdate).toHaveLength(1);
      expect(result.toUpdate[0]).toEqual({
        id: 'uuid-1',
        quantity: 5 // 2 + 3
      });
    });

    it('should handle multiple products and cumulative additions in the same batch', () => {
      const currentItems: PlanningItem[] = [
        { id: 'uuid-1', code: 'P1', description: 'P1', quantity: 2, unit: 'UN', synced: false, updatedAt: '' }
      ];
      const productsToAdd = [
        { product: mockProduct, quantity: 3 },
        { product: mockProduct, quantity: 10 },
        { product: { ...mockProduct, id: 'P2', description: 'P2' }, quantity: 1 }
      ];

      const result = PlanningLogic.calculateAdditions(currentItems, productsToAdd);

      expect(result.toUpdate).toHaveLength(2); // Duas atualizações para P1 (acumuladas)
      expect(result.toUpdate[0].quantity).toBe(5);
      expect(result.toUpdate[1].quantity).toBe(15);
      
      expect(result.toAdd).toHaveLength(1); // P2 é novo
      expect(result.toAdd[0].code).toBe('P2');
    });
  });

  describe('validateQuantity', () => {
    it('should return 1 if quantity is less than 1', () => {
      expect(PlanningLogic.validateQuantity(0)).toBe(1);
      expect(PlanningLogic.validateQuantity(-5)).toBe(1);
    });

    it('should return the original quantity if it is 1 or more', () => {
      expect(PlanningLogic.validateQuantity(1)).toBe(1);
      expect(PlanningLogic.validateQuantity(100)).toBe(100);
    });
  });
});
