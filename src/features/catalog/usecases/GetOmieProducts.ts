import { Product } from '../../../types/api';
import { CatalogRepository } from '../infra/CatalogRepository';
import { findMetaTotal, findArray, normalizeProduct } from '../domain/CatalogNormalizer';
import { Result } from '../../../lib/Result';
import { validateOmieProducts } from '../../products/infra/ProductSchemas';

/**
 * UseCase: Busca produtos no catálogo do Omie.
 * Pilar 1: Result Pattern.
 * Pilar 3: Zod-First na Infra.
 */
export async function getOmieProducts(): Promise<Result<Product[]>> {
  let allProducts: Product[] = [];
  let page = 1;
  let hasMore = true;
  let expectedTotal: number | null = null;

  try {
    while (hasMore) {
      const response = await CatalogRepository.getProductsPage(page);
      const res = response.data;
      
      if (expectedTotal === null) {
        expectedTotal = findMetaTotal(res);
      }
      
      const pageData = findArray(res);
      
      if (!Array.isArray(pageData) || pageData.length === 0) {
        hasMore = false;
      } else {
        // Validação Zod
        const validation = validateOmieProducts(pageData);
        const dataToNormalize = validation.success ? validation.data : pageData;

        if (!validation.success) {
          console.warn(`Página ${page} do catálogo com dados fora do padrão:`, validation.error);
        }

        const newProducts = dataToNormalize
          .filter((p: any) => {
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

      if (page > 300) hasMore = false; 
    }
    
    return Result.ok(allProducts);
  } catch (err) {
    return Result.fail(err instanceof Error ? err.message : 'Erro ao carregar catálogo da Omie.');
  }
}
