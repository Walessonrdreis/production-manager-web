import { describe, it, expect } from 'vitest';
import { SectorsLogic } from '../SectorsLogic';
import { Sector, Product } from '../../../../types/api';

describe('SectorsLogic', () => {
  describe('calculateProductCounts', () => {
    it('should correctly count products per sector', () => {
      const products: Partial<Product>[] = [
        { id: '1', sectorIds: ['S1'] },
        { id: '2', sectorIds: ['S1', 'S2'] },
        { id: '3', sectorIds: ['S2'] },
        { id: '4', sectorIds: [] }
      ];

      const counts = SectorsLogic.calculateProductCounts(products as Product[]);

      expect(counts['S1']).toBe(2);
      expect(counts['S2']).toBe(2);
      expect(counts['S3']).toBeUndefined();
    });
  });

  describe('filterSectors', () => {
    const sectors: Sector[] = [
      { id: 'S1', name: 'Marcenaria', description: 'Corte de madeira' },
      { id: 'S2', name: 'Pintura', description: 'Acabamento final' }
    ];

    it('should return all sectors if search term is empty', () => {
      expect(SectorsLogic.filterSectors(sectors, '')).toHaveLength(2);
    });

    it('should filter by name', () => {
      const result = SectorsLogic.filterSectors(sectors, 'marce');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('S1');
    });

    it('should filter by description', () => {
      const result = SectorsLogic.filterSectors(sectors, 'acabamento');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('S2');
    });

    it('should be case insensitive', () => {
      const result = SectorsLogic.filterSectors(sectors, 'PINTURA');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('S2');
    });
  });
});
