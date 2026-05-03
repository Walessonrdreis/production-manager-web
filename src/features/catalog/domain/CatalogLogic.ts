import { Product } from '../../../types/api';

export const CatalogLogic = {
  /**
   * Filtra produtos baseado em múltiplos critérios.
   */
  filterProducts(
    products: Product[],
    filters: {
      search: string;
      familyFilter: string;
      sectorFilter: string;
      stockLevel: 'all' | 'low' | 'normal';
    }
  ): Product[] {
    const { search, familyFilter, sectorFilter, stockLevel } = filters;
    const searchLower = search.toLowerCase();

    return products.filter(p => {
      const matchesSearch = !search || 
        p.description.toLowerCase().includes(searchLower) || 
        p.code.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower) ||
        p.family.toLowerCase().includes(searchLower);
      
      const matchesFamily = !familyFilter || familyFilter === 'Todas' || p.family === familyFilter;
      const sectors = p.sectorIds || ((p as any).sectorId ? [(p as any).sectorId] : []);
      const matchesSector = !sectorFilter || (sectorFilter === 'none' ? sectors.length === 0 : sectors.includes(sectorFilter));
      const matchesStock = stockLevel === 'all' || (stockLevel === 'low' ? p.stock <= 10 : p.stock > 10);
      
      return matchesSearch && matchesFamily && matchesSector && matchesStock;
    });
  },

  /**
   * Extrai lista única de famílias dos produtos.
   */
  extractFamilies(products: Product[]): string[] {
    const unique = new Set(products.map(p => p.family).filter(Boolean));
    return ['Todas', ...Array.from(unique).sort()];
  }
};
