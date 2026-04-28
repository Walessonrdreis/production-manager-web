import { ProducedRepository } from '../infra/ProducedRepository';

/**
 * UseCase: Marca um registro de produção como sincronizado
 */
export async function markProducedAsSynced(id: string) {
  return ProducedRepository.markAsSynced(id);
}
