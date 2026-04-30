import { type ProducedRecord } from '../../../db/models';
import { ProducedRepository } from '../infra/ProducedRepository';

export async function addProducedRecord(description: string, quantity: number): Promise<ProducedRecord> {
  const id = `manual-${Date.now()}`;
  return ProducedRepository.save({ id, description, quantity });
}
