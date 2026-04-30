import { Product } from '../../../types/api';
import { PlanningRepository } from '../infra/PlanningRepository';
import { PlanningLogic } from '../domain/PlanningLogic';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Adiciona múltiplos produtos ao planejamento com quantidade padrão 1.
 * Pilar 1: Result Pattern.
 */
export async function addBulkPlanningItems(products: Product[]): Promise<Result<void>> {
  try {
    const currentItems = await PlanningRepository.getAll();
    const productsWithQuantity = products.map(p => ({ product: p, quantity: 1 }));

    const { toAdd, toUpdate } = PlanningLogic.calculateAdditions(currentItems, productsWithQuantity);

    if (toAdd.length > 0) {
      await PlanningRepository.bulkAdd(toAdd);
    }

    if (toUpdate.length > 0) {
      await PlanningRepository.bulkUpdate(toUpdate);
    }

    return Result.ok(undefined);
  } catch (err) {
    return Result.fail(err instanceof Error ? err.message : 'Erro ao adicionar produtos em lote.');
  }
}
