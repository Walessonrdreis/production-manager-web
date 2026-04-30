import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

export async function removeProducedRecord(id: string): Promise<Result<void>> {
  try {
    await ProducedRepository.delete(id);
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao remover registro de produção.');
  }
}
