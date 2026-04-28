import { PlanningRepository } from '../infra/PlanningRepository';

/**
 * UseCase: Retorna todos os itens do planejamento local
 */
export async function getPlanningItems() {
  return PlanningRepository.getAll();
}
