import { ProductionLogic } from '../domain/ProductionLogic';
import { ProducedRepository } from '../infra/ProducedRepository';

/**
 * UseCase: Alterna a seleção de todos os itens de uma descrição.
 * Recupera os registros atuais, aplica a lógica de domínio e persiste as alterações.
 */
export async function toggleAllProduced(description: string, totalNeeded: number) {
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
    return await ProducedRepository.save(recordToAdd);
  }

  return null;
}
