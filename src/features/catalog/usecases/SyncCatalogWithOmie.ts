import { CatalogRepository } from '../infra/CatalogRepository';

/**
 * UseCase: Solicita sincronização forçada no backend
 */
export async function syncCatalogWithOmie(): Promise<any> {
  const { data } = await CatalogRepository.syncWithOmie();
  return data;
}
