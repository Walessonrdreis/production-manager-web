import { Product } from '../../../types/api';
import { PlanningRepository } from '../infra/PlanningRepository';
import { PlanningLogic } from '../domain/PlanningLogic';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Adiciona um item ao planejamento.
 * Pilar 1: Result Pattern.
 */
export async function addPlanningItem(
  product: Product, 
  quantity: number, 
  sectorId: string, 
  sectorName: string
): Promise<Result<void>> {
  try {
    if (quantity <= 0) {
      return Result.fail('A quantidade deve ser maior que zero.');
    }

    const currentItems = await PlanningRepository.getAll();
    
    const { toAdd, toUpdate } = PlanningLogic.calculateAdditions(currentItems, [
      { product, quantity, sectorId, sectorName }
    ]);

    if (toAdd.length > 0) {
      await PlanningRepository.add(toAdd[0]);
    }

    if (toUpdate.length > 0) {
      await PlanningRepository.update(toUpdate[0].id, { quantity: toUpdate[0].quantity });
    }

    return Result.ok(undefined);
  } catch (err) {
    return Result.fail(err instanceof Error ? err.message : 'Erro desconhecido ao adicionar item.');
  }
}
