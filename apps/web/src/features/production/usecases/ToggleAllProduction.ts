import { ProductionLogic } from '../domain/ProductionLogic';
import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Alterna a seleção de todos os itens de uma descrição.
 * Recupera os registros atuais, aplica a lógica de domínio e persiste as alterações.
 */
export async function toggleAllProduction(ordersContainingProduct: any[], description: string): Promise<Result<any>> {
  try {
    const existing = await ProducedRepository.getByDescription(description);
    
    const { idsToDelete, recordsToAdd } = ProductionLogic.calculateToggleAllByOrdersAction(
      description,
      ordersContainingProduct,
      existing
    );

    if (idsToDelete.length > 0) {
      await ProducedRepository.bulkDelete(idsToDelete);
    }

    if (recordsToAdd && recordsToAdd.length > 0) {
      const saved = await ProducedRepository.bulkSave(recordsToAdd);
      return Result.ok(saved);
    }

    return Result.ok(null);
  } catch (err) {
    return Result.fail('Erro ao alternar seleção de produção.');
  }
}
