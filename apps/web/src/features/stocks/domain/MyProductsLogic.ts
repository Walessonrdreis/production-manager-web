import { Product } from '../../../types/api';

export class MyProductsLogic {
  static filterProducts(
    products: Product[],
    search: string,
    selectedFamily: string,
    selectedSector: string
  ): Product[] {
    return products.filter((p) => {
      const pFamily = p.family || 'Nenhuma';
      
      const sLower = search.toLowerCase();
      const codeMatches = p.code ? p.code.toLowerCase().includes(sLower) : false;
      const descMatches = p.description ? p.description.toLowerCase().includes(sLower) : false;
      const idMatches = p.id ? p.id.toLowerCase().includes(sLower) : false;
      
      const matchSearch = codeMatches || descMatches || idMatches;
      const matchFamily = selectedFamily === 'all' || pFamily === selectedFamily;
      
      let matchSector = selectedSector === 'all';
      if (!matchSector) {
         if ((p as any).sectorIds && (p as any).sectorIds.includes(selectedSector)) {
             matchSector = true;
         } else if ((p as any).sectorId === selectedSector) {
             matchSector = true;
         }
      }

      return matchSearch && matchFamily && matchSector;
    });
  }
}
