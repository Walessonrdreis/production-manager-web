import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Remove um registro de produção local.
 */
export async function removeLocalProduced(id: string): Promise<Result<void>> {
  try {
    await ProducedRepository.delete(id);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao remover registro local de produção.');
  }
}
