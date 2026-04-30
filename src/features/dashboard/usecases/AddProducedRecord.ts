import { type ProducedRecord } from '../../../db/models';
import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

export async function addProducedRecord(description: string, quantity: number): Promise<Result<ProducedRecord>> {
  try {
    const id = `manual-${Date.now()}`;
    const record = await ProducedRepository.save({ id, description, quantity });
    return Result.ok(record);
  } catch (err) {
    return Result.fail('Erro ao salvar registro de produção.');
  }
}
