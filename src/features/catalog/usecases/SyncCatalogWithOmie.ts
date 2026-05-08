import { CatalogRepository } from '../infra/CatalogRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Solicita sincronização forçada
 */
export async function syncCatalogWithOmie(): Promise<Result<any>> {
  try {
    const { data } = await CatalogRepository.syncWithOmie();
    return Result.ok(data);
  } catch (err) {
    console.error('Error syncing catalog', err);
    return Result.fail('Erro ao sincronizar catálogo com a Omie.');
  }
}

export async function syncStockWithOmie(): Promise<Result<any>> {
  try {
    const { data } = await CatalogRepository.syncStockWithOmie();
    return Result.ok(data);
  } catch (err) {
    console.error('Error syncing stock', err);
    return Result.fail('Erro ao atualizar estoque com a Omie.');
  }
}
