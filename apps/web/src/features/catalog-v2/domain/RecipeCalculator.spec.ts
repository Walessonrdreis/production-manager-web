import { RecipeCalculator } from './RecipeCalculator';

describe('RecipeCalculator', () => {
  it('should calculate 1KG normalized formula correctly without loss', () => {
    const items = [
      { id: '1', quantity: 500, unit: 'g', isPackaging: false },
      { id: '2', quantity: 500, unit: 'g', isPackaging: false }
    ] as any;

    const result = RecipeCalculator.calculate(items);
    
    expect(result.totalRawWeightKg).toBe(1);
    expect(result.netYieldKg).toBe(1);
    expect(result.items[0].normalizedQuantity).toBe(0.5);
    expect(result.items[1].normalizedQuantity).toBe(0.5);
    expect(result.items[0].normalizedUnit).toBe('kg');
  });

  it('should apply volume parity correctly (ml, L -> Kg)', () => {
    const items = [
      { id: '1', quantity: 2, unit: 'l', isPackaging: false },
      { id: '2', quantity: 2000, unit: 'ml', isPackaging: false },
      { id: '3', quantity: 6, unit: 'kg', isPackaging: false }
    ] as any;
    
    // total raw = 2 + 2 + 6 = 10kg
    const result = RecipeCalculator.calculate(items);
    
    expect(result.totalRawWeightKg).toBe(10);
    // for 1kg, we need 10% of each
    expect(result.items[0].normalizedQuantity).toBe(0.2);
    expect(result.items[1].normalizedQuantity).toBe(0.2);
    expect(result.items[2].normalizedQuantity).toBe(0.6);
  });

  it('should handle percentage loss correctly', () => {
    const items = [
      { id: '1', quantity: 1, unit: 'kg', isPackaging: false }
    ] as any;

    // 10% loss -> to get 1kg net, you need 1 / (1-0.10) = 1.1111... kg
    const result = RecipeCalculator.calculate(items, 10);
    
    expect(result.totalRawWeightKg).toBe(1);
    expect(result.netYieldKg).toBe(0.9);
    
    expect(result.items[0].normalizedQuantity).toBeCloseTo(1.1111, 4);
    expect(result.items[0].percentageOfRaw).toBe(1);
  });

  it('should keep packaging items decoupled from raw mass and handle them linearly', () => {
    const items = [
      { id: '1', quantity: 2, unit: 'kg', isPackaging: false },
      { id: '2', quantity: 1, unit: 'un', isPackaging: true } // 1 packaging per 2kg batch
    ] as any;

    const result = RecipeCalculator.calculate(items);
    
    expect(result.totalRawWeightKg).toBe(2);
    // So to make 1kg (half batch), we need 0.5 packaging
    expect(result.items[1].normalizedQuantity).toBe(0.5);
    expect(result.items[1].normalizedUnit).toBe('un');
  });

  it('should treat any un unit as packaging conceptually for weight purposes', () => {
    const items = [
      { id: '1', quantity: 500, unit: 'g', isPackaging: false },
      { id: '2', quantity: 10, unit: 'un', isPackaging: false } // unit is un, so weight isn't added
    ] as any;

    const result = RecipeCalculator.calculate(items);
    
    // total raw weight should just be the 500g (0.5kg)
    expect(result.totalRawWeightKg).toBe(0.5);
    
    // scaling 0.5kg to 1kg means we multiply quantities by 2.
    // 10 'un' per 0.5kg = 20 'un' per 1kg
    expect(result.items[1].normalizedQuantity).toBe(20);
    expect(result.items[1].normalizedUnit).toBe('un');
  });
});
