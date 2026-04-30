import { PlanningRepository } from '../infra/PlanningRepository';
import { Result } from '../../../lib/Result';

export async function removePlanningItem(id: string | number): Promise<Result<void>> {
  try {
    await PlanningRepository.delete(String(id));
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao remover item do planejamento.');
  }
}
