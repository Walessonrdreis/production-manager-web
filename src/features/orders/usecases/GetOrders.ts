import { Order, OrdersRepository } from '../index';
import { findOrdersArray, normalizeOrder } from '../domain/OrderNormalizer';

/**
 * UseCase: Busca e normaliza a lista de ordens de venda (pedidos)
 */
export async function getOrders(): Promise<Order[]> {
  const response = await OrdersRepository.getAll();
  const res = response.data;
  
  const rawOrders = findOrdersArray(res) || [];
  return rawOrders.map(normalizeOrder);
}
