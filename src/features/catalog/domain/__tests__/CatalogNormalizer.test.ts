import { describe, it, expect } from 'vitest';
import { findMetaTotal, findArray, normalizeProduct } from '../CatalogNormalizer';

describe('CatalogNormalizer', () => {
  describe('findMetaTotal', () => {
    it('should find total in different formats', () => {
      expect(findMetaTotal({ meta: { total: 100 } })).toBe(100);
      expect(findMetaTotal({ total_registros: 50 })).toBe(50);
      expect(findMetaTotal({ nested: { total: 25 } })).toBe(25);
    });

    it('should return null if not found', () => {
      expect(findMetaTotal({})).toBeNull();
      expect(findMetaTotal({ someArray: [] })).toBeNull();
    });
  });

  describe('findArray', () => {
    it('should find array in various common keys', () => {
      expect(findArray({ data: [1, 2] })).toEqual([1, 2]);
      expect(findArray({ products: [3] })).toEqual([3]);
      expect(findArray({ nested: { items: [4, 5] } })).toEqual([4, 5]);
    });

    it('should return object if it is already an array', () => {
      const arr = [10];
      expect(findArray(arr)).toBe(arr);
    });

    it('should return null if no array found', () => {
      expect(findArray({ a: 1 })).toBeNull();
    });
  });

  describe('normalizeProduct', () => {
    it('should normalize product with various field mappings', () => {
      const p = {
        codigo_produto: 123,
        codigo: 'C001',
        descricao: 'Product One',
        familia: 'Fam 1',
        estoque: '10',
        valor_unitario: 50.5
      };

      const result = normalizeProduct(p);

      expect(result).toEqual({
        id: '123',
        code: 'C001',
        description: 'Product One',
        family: 'Fam 1',
        stock: 10,
        price: 50.5,
        unit: 'UN',
        sectorId: undefined
      });
    });

    it('should handle missing fields with defaults', () => {
      const result = normalizeProduct({});
      expect(result.unit).toBe('UN');
      expect(result.stock).toBe(0);
      expect(result.price).toBe(0);
    });
  });
});
