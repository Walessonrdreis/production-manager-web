import { Product } from '../../../types/api';
import { CatalogRepository } from '../infra/CatalogRepository';
import { findMetaTotal, findArray, normalizeProduct } from '../domain/CatalogNormalizer';

/**
 * UseCase: Busca produtos no catálogo do Omie
 */
export async function getOmieProducts(): Promise<Product[]> {
  let allProducts: Product[] = [];
  let page = 1;
  let hasMore = true;
  let expectedTotal: number | null = null;

  while (hasMore) {
    try {
      const response = await CatalogRepository.getProductsPage(page);
      const res = response.data;
      
      if (expectedTotal === null) {
        expectedTotal = findMetaTotal(res);
      }
      
      const pageData = findArray(res);
      
      if (!Array.isArray(pageData) || pageData.length === 0) {
        hasMore = false;
      } else {
        const newProducts = pageData
          .filter(p => {
            const id = p.omieCode || p.id || p.codigo_produto;
            return !allProducts.find(ex => ex.id === id);
          })
          .map(normalizeProduct);
        
        if (newProducts.length === 0 && allProducts.length > 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...newProducts];
          
          if (expectedTotal !== null && allProducts.length >= expectedTotal) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar página do catálogo:', error);
      hasMore = false;
    }

    if (page > 300) hasMore = false; 
  }
  
  return allProducts;
}
