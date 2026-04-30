import { PlanningRepository } from '../infra/PlanningRepository';
import { PlanningLogic } from '../domain/PlanningLogic';
import { Result } from '../../../lib/Result';

export async function updatePlanningItem(id: string | number, quantity: number): Promise<Result<void>> {
  try {
    const validQuantity = PlanningLogic.validateQuantity(quantity);
    await PlanningRepository.update(String(id), { quantity: validQuantity });
    return Result.ok(undefined);
  } catch (err) {
    return Result.fail('Erro ao atualizar quantidade do item.');
  }
}
