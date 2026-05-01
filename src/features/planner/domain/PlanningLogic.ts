import { type PlanningItem } from '../../../db/models';
import { type Product } from '../../../types/api';

export type { PlanningItem };

export const PlanningLogic = {
  /**
   * Calcula as operações necessárias para adicionar produtos ao planejamento.
   * Se o produto (pelo código) já existir, incrementa a quantidade.
   * Caso contrário, cria um novo item.
   */
  calculateAdditions(
    currentItems: PlanningItem[],
    productsToAdd: { product: Product, quantity: number, sectorId: string, sectorName: string }[]
  ): { 
    toAdd: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[], 
    toUpdate: { id: string, quantity: number }[] 
  } {
    const toAdd: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[] = [];
    const toUpdate: { id: string, quantity: number }[] = [];

    // Map para facilitar busca por composto [code-sectorId] no estado atual
    const itemsByKey = new Map<string, PlanningItem>();
    currentItems.forEach(item => {
      const key = `${item.code}-${item.sectorId || 'default'}`;
      itemsByKey.set(key, item);
    });

    productsToAdd.forEach(({ product, quantity, sectorId, sectorName }) => {
      const productCode = String(product.id);
      const key = `${productCode}-${sectorId}`;
      const existing = itemsByKey.get(key);

      if (existing) {
        toUpdate.push({
          id: existing.id,
          quantity: existing.quantity + quantity
        });
        // Atualiza o map para somas subsequentes no mesmo lote
        itemsByKey.set(key, { ...existing, quantity: existing.quantity + quantity });
      } else {
        toAdd.push({
          code: productCode,
          description: product.description,
          unit: product.unit || 'UN',
          quantity: quantity,
          sectorId,
          sectorName
        });
        // Mock de item para o map caso o mesmo produto venha duplicado no lote de entrada
        itemsByKey.set(key, {
          id: 'temp',
          code: productCode,
          description: product.description,
          unit: product.unit || 'UN',
          quantity: quantity,
          sectorId,
          sectorName,
          synced: false,
          updatedAt: ''
        });
      }
    });

    return { toAdd, toUpdate };
  },

  /**
   * Garante que a quantidade seja sempre pelo menos 1.
   */
  validateQuantity(quantity: number): number {
    return Math.max(1, quantity);
  },

  /**
   * Filtra produtos baseado em busca textual.
   */
  filterProducts(products: Product[], search: string): Product[] {
    const normalize = (str: string) => 
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const searchNormalized = normalize(search);
    if (!searchNormalized) return products;

    return products.filter(p => {
      const descriptionMatch = normalize(p.description).includes(searchNormalized);
      const idMatch = normalize(String(p.id)).includes(searchNormalized);
      const familyMatch = p.family ? normalize(p.family).includes(searchNormalized) : false;
      const codeMatch = p.code ? normalize(p.code).includes(searchNormalized) : false;
      
      return descriptionMatch || idMatch || familyMatch || codeMatch;
    });
  }
};
