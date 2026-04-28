import { ProducedRepository } from '../infra/ProducedRepository';

/**
 * UseCase: Alterna a seleção de um registro de produção por pedido
 */
export async function toggleProducedOrder(
  id: string, 
  description: string, 
  quantity: number, 
  orderId?: string, 
  orderNumber?: string
) {
  return ProducedRepository.toggleOrder(id, description, quantity, orderId, orderNumber);
}
