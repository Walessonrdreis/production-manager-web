import { ProductionLogic } from '../domain/ProductionLogic';
import { ProducedRepository } from '../infra/ProducedRepository';
import { Result } from '../../../lib/Result';

/**
 * UseCase: Alterna a seleção de todos os itens de uma descrição.
 * Recupera os registros atuais, aplica a lógica de domínio e persiste as alterações.
 */
export async function toggleAllProduced(description: string, totalNeeded: number): Promise<Result<any>> {
  try {
    const existing = await ProducedRepository.getByDescription(description);
    
    const { idsToDelete, recordToAdd } = ProductionLogic.calculateToggleAllAction(
      description,
      totalNeeded,
      existing
    );

    if (idsToDelete.length > 0) {
      await ProducedRepository.bulkDelete(idsToDelete);
    }

    if (recordToAdd) {
      const saved = await ProducedRepository.save(recordToAdd);
      return Result.ok(saved);
    }

    return Result.ok(null);
  } catch (err) {
    return Result.fail('Erro ao alternar seleção de produção.');
  }
}
