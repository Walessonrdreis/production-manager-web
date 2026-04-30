import { CatalogRepository } from '../infra/CatalogRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Solicita sincronização forçada no backend.
 */
export async function syncCatalogWithOmie(): Promise<Result<any>> {
  try {
    const { data } = await CatalogRepository.syncWithOmie();
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao sincronizar catálogo com a Omie.');
  }
}
