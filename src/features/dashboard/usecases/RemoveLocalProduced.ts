import { ProducedRepository } from '../infra/ProducedRepository';

/**
 * UseCase: Remove um registro de produção local
 */
export async function removeLocalProduced(id: string) {
  return ProducedRepository.delete(id);
}
