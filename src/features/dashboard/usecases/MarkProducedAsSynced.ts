import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Marca um registro de produção como sincronizado.
 */
export async function markProducedAsSynced(id: string): Promise<Result<void>> {
  try {
    await ProducedRepository.markAsSynced(id);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao marcar registro como sincronizado.');
  }
}
