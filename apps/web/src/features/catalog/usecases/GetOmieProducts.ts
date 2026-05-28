import { Product } from '../../../types/api';
import { CatalogRepository } from '../infra/CatalogRepository';
import { findMetaTotal, findArray, normalizeProduct } from '../domain/CatalogNormalizer';
import { Result } from '../../../lib/Result';
import { validateOmieProducts } from '../../stocks/infra/ProductSchemas';
import { productRepository } from '../infra/ProductIndexedDBRepo';

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
          // Log simplificado para evitar ruído no console e facilitar debug humano se necessário
          console.warn(`[Catalog] Página ${page}: Alguns campos vieram em formato diferente do esperado, mas o sistema irá tentar processar mesmo assim.`);
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
    
    // Save to local cache silently
    setTimeout(() => {
      productRepository.bulkSave(allProducts.map(p => ({
        id: p.id,
        code: p.code || '',
        description: p.description || 'Produto sem nome',
        unit: p.unit || 'UN',
        family: p.family || '',
        price: p.price || 0,
        stock: p.stock || 0,
        minStock: p.minStock || 0,
        synced: true,
        lastModified: Date.now(),
        version: 1,
        savedAt: new Date().toISOString(),
        sectorIds: p.sectorIds || [],
        category: p.category,
        stockType: p.stockType
      }))).catch(() => {});
    }, 0);

    return Result.ok(allProducts);
  } catch (err) {
    console.error('[Catalog] Falha na rede, tentando cache local', err);
    try {
      const localProducts = await productRepository.getAll();
      if (localProducts && localProducts.length > 0) {
        return Result.ok(localProducts.map(lp => ({
          id: lp.id,
          code: lp.code,
          description: lp.description,
          unit: lp.unit,
          family: lp.family,
          price: lp.price,
          stock: lp.stock,
          minStock: lp.minStock
        } as Product)));
      }
    } catch (localErr) {
      console.error('[Catalog] Erro ao carregar catálogo local:', localErr);
    }
    return Result.fail(err instanceof Error ? err.message : 'Erro ao carregar catálogo da Omie.');
  }
}

