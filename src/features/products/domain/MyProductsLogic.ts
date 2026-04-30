import { Product } from '../../../types/api';

export const MyProductsLogic = {
  /**
   * Filtra os produtos salvos (favoritos) baseado em busca textual.
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
