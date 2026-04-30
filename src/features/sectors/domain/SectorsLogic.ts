import { Sector, Product } from '../../../types/api';

export const SectorsLogic = {
  /**
   * Calcula o número de produtos vinculados a cada setor.
   */
  calculateProductCounts(products: Product[]): Record<string, number> {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      if (p.sectorId) {
        counts[p.sectorId] = (counts[p.sectorId] || 0) + 1;
      }
    });
    return counts;
  },

  /**
   * Filtra setores baseado em um termo de busca.
   */
  filterSectors(sectors: Sector[], searchTerm: string): Sector[] {
    if (!searchTerm) return sectors;
    const term = searchTerm.toLowerCase();
    return sectors.filter(s => 
      s.name.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      s.id.toLowerCase().includes(term)
    );
  }
};
