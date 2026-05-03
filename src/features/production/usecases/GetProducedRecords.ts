import { type ProducedRecord } from '../../../db/models';
import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

export async function getProducedRecords(): Promise<Result<ProducedRecord[]>> {
  try {
    const data = await ProducedRepository.getAll();
    return Result.ok(data);
  } catch (err) {
    return Result.fail('Erro ao buscar registros de produção.');
  }
}
