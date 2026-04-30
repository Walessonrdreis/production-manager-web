import { type ProducedRecord } from '../../../db/models';
import { ProducedRepository } from '../infra/ProducedRepository';

export async function getProducedRecords(): Promise<ProducedRecord[]> {
  return ProducedRepository.getAll();
}
