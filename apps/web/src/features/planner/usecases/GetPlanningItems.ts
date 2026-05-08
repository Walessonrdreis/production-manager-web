import { PlanningRepository } from '../infra/PlanningRepository';
import { Result } from '../../../lib/Result';
import { PlanningItem } from '../domain/PlanningLogic';

/**
 * UseCase: Retorna todos os itens do planejamento local.
 */
export async function getPlanningItems(): Promise<Result<PlanningItem[]>> {
  try {
    const items = await PlanningRepository.getAll();
    return Result.ok(items);
  } catch (err) {
    return Result.fail('Erro ao carregar itens do planejamento.');
  }
}
