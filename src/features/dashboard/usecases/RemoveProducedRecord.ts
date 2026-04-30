import { ProducedRepository } from '../infra/ProducedRepository';

export async function removeProducedRecord(id: string): Promise<void> {
  return ProducedRepository.delete(id);
}
