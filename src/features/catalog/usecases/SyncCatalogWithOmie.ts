import { CatalogRepository } from '../infra/CatalogRepository';
import { Result } from '../../../lib/Result';
import { FirebaseProductRepository } from '../../products/infra/FirebaseProductRepository';

/**
 * UseCase: Solicita sincronização forçada e salva no Firebase
 */
export async function syncCatalogWithOmie(): Promise<Result<any>> {
  try {
    const { data } = await CatalogRepository.syncWithOmie();
    
    if (data && data.data && Array.isArray(data.data)) {
      // Salvar cada item no Firebase
      for (const p of data.data) {
        const id = p.omieCode || p.code || p.id;
        if (!id) continue;
        
        await FirebaseProductRepository.save({
          id,
          code: p.omieCode || p.code || '',
          description: p.description || '',
          family: p.family || '',
          unit: p.unit || 'UN',
          stock: parseFloat(p.stockQuantity) || p.stock || 0,
          synced: true,
          sectorIds: [], // Inicializado como vazio
          price: 0,
          lastModified: Date.now(),
          version: 1,
          savedAt: new Date().toISOString()
        } as any);
      }
    }
    
    return Result.ok(data);
  } catch (err) {
    console.error('Error syncing catalog', err);
    return Result.fail('Erro ao sincronizar catálogo com a Omie.');
  }
}
