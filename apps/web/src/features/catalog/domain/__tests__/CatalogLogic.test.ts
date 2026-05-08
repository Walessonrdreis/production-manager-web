import { describe, it, expect } from 'vitest';
import { CatalogLogic } from '../CatalogLogic';
import { Product } from '../../../../types/api';

describe('CatalogLogic', () => {
  const mockProducts: Partial<Product>[] = [
    { id: '1', code: 'A1', description: 'Papel', family: 'Escritório', stock: 5, sectorIds: ['S1'] },
    { id: '2', code: 'B2', description: 'Caneta', family: 'Escritório', stock: 20, sectorIds: ['S1'] },
    { id: '3', code: 'C3', description: 'Martelo', family: 'Ferramentas', stock: 2, sectorIds: ['S2'] }
  ];

  describe('filterProducts', () => {
    it('should filter by search term', () => {
      const result = CatalogLogic.filterProducts(mockProducts as Product[], {
        search: 'martelo',
        familyFilter: '',
        sectorFilter: '',
        stockLevel: 'all'
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('should filter by family', () => {
      const result = CatalogLogic.filterProducts(mockProducts as Product[], {
        search: '',
        familyFilter: 'Escritório',
        sectorFilter: '',
        stockLevel: 'all'
      });
      expect(result).toHaveLength(2);
    });

    it('should filter by stock level (low)', () => {
      const result = CatalogLogic.filterProducts(mockProducts as Product[], {
        search: '',
        familyFilter: '',
        sectorFilter: '',
        stockLevel: 'low'
      });
      expect(result).toHaveLength(2); // Papel (5) e Martelo (2)
    });
  });

  describe('extractFamilies', () => {
    it('should extract sorted unique families with "Todas" prefix', () => {
      const result = CatalogLogic.extractFamilies(mockProducts as Product[]);
      expect(result).toEqual(['Todas', 'Escritório', 'Ferramentas']);
    });
  });
});
