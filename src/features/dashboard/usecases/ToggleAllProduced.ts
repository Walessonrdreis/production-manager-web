import { ProducedRepository } from '../infra/ProducedRepository';

/**
 * UseCase: Alterna a seleção de todos os itens de uma descrição
 */
export async function toggleAllProduced(description: string, totalNeeded: number) {
  return ProducedRepository.toggleAll(description, totalNeeded);
}
