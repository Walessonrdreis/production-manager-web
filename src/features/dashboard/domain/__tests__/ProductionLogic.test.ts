import { describe, it, expect } from 'vitest';
import { ProductionLogic } from '../ProductionLogic';
import { type ProducedRecord } from '../../../../db/models';

describe('ProductionLogic', () => {
  describe('calculateToggleAllAction', () => {
    const description = 'Produto Teste';
    const totalNeeded = 10;

    it('should return action to consolidate records when current total is less than needed', () => {
      const currentRecords: ProducedRecord[] = [
        { id: '1', description, quantity: 2, synced: false, updatedAt: '' },
        { id: '2', description, quantity: 3, synced: false, updatedAt: '' }
      ];

      const result = ProductionLogic.calculateToggleAllAction(description, totalNeeded, currentRecords);

      expect(result.idsToDelete).toEqual(['1', '2']);
      expect(result.recordToAdd).toEqual({
        id: `all-${description}`,
        description,
        quantity: 10
      });
    });

    it('should return action to delete all when current total meets or exceeds needed', () => {
      const currentRecords: ProducedRecord[] = [
        { id: `all-${description}`, description, quantity: 10, synced: false, updatedAt: '' }
      ];

      const result = ProductionLogic.calculateToggleAllAction(description, totalNeeded, currentRecords);

      expect(result.idsToDelete).toEqual([`all-${description}`]);
      expect(result.recordToAdd).toBeNull();
    });

    it('should handle empty current records by creating a new consolidated record', () => {
      const result = ProductionLogic.calculateToggleAllAction(description, totalNeeded, []);

      expect(result.idsToDelete).toEqual([]);
      expect(result.recordToAdd).toEqual({
        id: `all-${description}`,
        description,
        quantity: 10
      });
    });
  });
});
