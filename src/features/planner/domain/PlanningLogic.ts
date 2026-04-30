import { type PlanningItem } from '../../../db/models';
import { type Product } from '../../../types/api';

export const PlanningLogic = {
  /**
   * Calcula as operações necessárias para adicionar produtos ao planejamento.
   * Se o produto (pelo código) já existir, incrementa a quantidade.
   * Caso contrário, cria um novo item.
   */
  calculateAdditions(
    currentItems: PlanningItem[],
    productsToAdd: { product: Product, quantity: number }[]
  ): { 
    toAdd: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[], 
    toUpdate: { id: string, quantity: number }[] 
  } {
    const toAdd: Omit<PlanningItem, 'id' | 'synced' | 'updatedAt'>[] = [];
    const toUpdate: { id: string, quantity: number }[] = [];

    // Map para facilitar busca por código no estado atual
    const itemsByCode = new Map<string, PlanningItem>();
    currentItems.forEach(item => itemsByCode.set(item.code, item));

    productsToAdd.forEach(({ product, quantity }) => {
      const productCode = String(product.id);
      const existing = itemsByCode.get(productCode);

      if (existing) {
        toUpdate.push({
          id: existing.id,
          quantity: existing.quantity + quantity
        });
        // Atualiza o map para somas subsequentes no mesmo lote
        itemsByCode.set(productCode, { ...existing, quantity: existing.quantity + quantity });
      } else {
        toAdd.push({
          code: productCode,
          description: product.description,
          unit: product.unit || 'UN',
          quantity: quantity
        });
        // Mock de item para o map caso o mesmo produto venha duplicado no lote de entrada
        itemsByCode.set(productCode, {
          id: 'temp',
          code: productCode,
          description: product.description,
          unit: product.unit || 'UN',
          quantity: quantity,
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
