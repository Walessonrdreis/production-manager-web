import { describe, it, expect } from 'vitest';
import { MyProductsLogic } from '../MyProductsLogic';
import { Product } from '../../../../types/api';

describe('MyProductsLogic', () => {
  const mockProducts: Partial<Product>[] = [
    { id: '1', code: 'P1', description: 'Papel', family: 'Escritório' },
    { id: '2', code: 'P2', description: 'Caneta', family: 'Escritório' },
    { id: '3', code: 'P3', description: 'Martelo', family: 'Ferramentas' }
  ];

  describe('filterProducts', () => {
    it('should return all products if search is empty', () => {
      const result = MyProductsLogic.filterProducts(mockProducts as Product[], '');
      expect(result).toHaveLength(3);
    });

    it('should filter by description', () => {
      const result = MyProductsLogic.filterProducts(mockProducts as Product[], 'martelo');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('should filter by family', () => {
      const result = MyProductsLogic.filterProducts(mockProducts as Product[], 'escritorio');
      expect(result).toHaveLength(2);
    });

    it('should filter by code', () => {
      const result = MyProductsLogic.filterProducts(mockProducts as Product[], 'P2');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });
});
