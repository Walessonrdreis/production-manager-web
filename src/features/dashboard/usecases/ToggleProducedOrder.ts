import { ProductionLogic } from '../domain/ProductionLogic';
import { ProducedRepository } from '../infra/ProducedRepository';

/**
 * UseCase: Alterna a seleção de um registro de produção por pedido.
 * Verifica a existência atual, aplica lógica de domínio e persiste criação ou deleção.
 */
export async function toggleProducedOrder(
  id: string, 
  description: string, 
  quantity: number, 
  orderId?: string, 
  orderNumber?: string
) {
  const existing = await ProducedRepository.getById(id);
  
  const { action, record } = ProductionLogic.calculateToggleAction(!!existing, {
    id,
    description,
    quantity,
    orderId,
    orderNumber
  });

  if (action === 'delete') {
    await ProducedRepository.delete(id);
    return null;
  } else if (record) {
    return await ProducedRepository.save(record);
  }
  
  return null;
}
