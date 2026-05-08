import { PlanningRepository } from '../infra/PlanningRepository';
import { Result } from '../../../lib/Result';

export async function clearPlanning(): Promise<Result<void>> {
  try {
    await PlanningRepository.clear();
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao limpar planejamento.');
  }
}
