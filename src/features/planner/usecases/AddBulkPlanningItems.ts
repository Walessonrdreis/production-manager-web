import { Product } from '../../../types/api';
import { addPlanningItem } from './AddPlanningItem';

/**
 * UseCase: Adiciona múltiplos produtos ao planejamento com quantidade padrão 1
 */
export async function addBulkPlanningItems(products: Product[]): Promise<void> {
  // Poderíamos usar uma transação no repositório futuramente para performance,
  // mas por ora mantemos a granularidade chamando o UseCase unitário.
  for (const product of products) {
    await addPlanningItem(product, 1);
  }
}
