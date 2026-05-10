import { Product } from '../../../types/api';

export const MyProductsLogic = {
  /**
   * Filtra os produtos salvos (favoritos) baseado em busca textual.
   */
  filterProducts(
    products: Product[], 
    search: string,
    familyFilter?: string,
    sectorFilter?: string
  ): Product[] {
    const normalize = (str: string) => 
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    let filtered = products;

    if (familyFilter && familyFilter !== 'all') {
      filtered = filtered.filter(p => p.family === familyFilter);
    }

    if (sectorFilter && sectorFilter !== 'all') {
      filtered = filtered.filter(p => (p.sectorIds || []).includes(sectorFilter));
    }

    const searchNormalized = normalize(search);
    if (!searchNormalized) return filtered;

    return filtered.filter(p => {
      const descriptionMatch = normalize(p.description || '').includes(searchNormalized);
      const idMatch = normalize(String(p.id || '')).includes(searchNormalized);
      const familyMatch = p.family ? normalize(p.family).includes(searchNormalized) : false;
      const codeMatch = p.code ? normalize(p.code).includes(searchNormalized) : false;
      
      return descriptionMatch || idMatch || familyMatch || codeMatch;
    });
  }
};
