export type RecipeUnit = 'g' | 'kg' | 'ml' | 'l' | 'un';

export interface RecipeItemInput {
  quantity: number;
  unit: RecipeUnit;
  isPackaging: boolean;
}

export type FormulaItemResult<T extends RecipeItemInput> = T & {
  normalizedQuantity: number;
  normalizedUnit: RecipeUnit;
  percentageOfRaw?: number;
};

export interface FormulationResult<T extends RecipeItemInput> {
  items: FormulaItemResult<T>[];
  totalRawWeightKg: number;
  netYieldKg: number;
}

export class RecipeCalculator {
  static normalizeUnitToKg(quantity: number, unit: RecipeUnit): number {
    switch (unit) {
      case 'g':
      case 'ml':
        return quantity / 1000;
      case 'kg':
      case 'l':
        return quantity;
      default:
        return 0; // 'un' does not contribute to weight
    }
  }

  static calculate<T extends RecipeItemInput>(items: T[], lossPercentage: number = 0): FormulationResult<T> {
    const rawItems = items.filter(i => !i.isPackaging && i.unit !== 'un');
    
    let totalRawWeightKg = 0;
    rawItems.forEach(item => {
      totalRawWeightKg += this.normalizeUnitToKg(item.quantity, item.unit);
    });

    const lossFactor = lossPercentage / 100;
    const netYieldKg = totalRawWeightKg * (1 - lossFactor);

    const results: FormulaItemResult<T>[] = items.map(item => {
      if (item.isPackaging || item.unit === 'un') {
        const normalizedQuantity = item.quantity; // Como solicitado: "é uma embalagem e pronto. não entra nos calculos e não multiplica"
        return {
          ...item,
          normalizedQuantity,
          normalizedUnit: item.unit
        };
      }

      const itemKg = this.normalizeUnitToKg(item.quantity, item.unit);
      const percentageOfRaw = totalRawWeightKg > 0 ? itemKg / totalRawWeightKg : 0;
      
      const requiredRawTotalFor1Kg = 1 / (1 - lossFactor);
      let normalizedQuantityKg = requiredRawTotalFor1Kg * percentageOfRaw;

      if (totalRawWeightKg === 0) {
        normalizedQuantityKg = 0;
      }

      return {
        ...item,
        percentageOfRaw,
        normalizedQuantity: normalizedQuantityKg,
        normalizedUnit: 'kg'
      };
    });

    return {
      items: results,
      totalRawWeightKg,
      netYieldKg
    };
  }
}
