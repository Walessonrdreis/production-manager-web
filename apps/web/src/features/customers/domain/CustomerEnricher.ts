import { type Order } from '../../orders/domain/OrderNormalizer';
import { CustomersRepository } from '../infra/CustomersRepository';

/**
 * Enriquece ordens de serviço com informações da base local de clientes.
 * Se uma ordem tiver um customerId (código Omie) que corresponda a um cliente local,
 * o nome do cliente é atualizado com o nome cadastrado localmente.
 */
export async function enrichOrdersWithLocalCustomers(orders: Order[]): Promise<Order[]> {
  try {
    const filterRes = await CustomersRepository.getAll();
    const localCustomers = (filterRes.success && filterRes.data) ? filterRes.data : [];
    
    // Criar mapa para busca rápida por omieCode
    const customerMap = new Map();
    localCustomers.forEach(c => {
      if (c.omieCode) customerMap.set(String(c.omieCode), c);
    });

    return orders.map(order => {
      const localCustomer = order.customerId ? customerMap.get(order.customerId) : null;
      
      if (localCustomer) {
        return {
          ...order,
          customerName: localCustomer.name, // Prioridade para o nome cadastrado localmente
          isLocalCustomer: true
        };
      }
      return {
        ...order,
        isLocalCustomer: false
      };
    });
  } catch (error) {
    console.warn('Falha ao enriquecer ordens com clientes locais:', error);
    return orders;
  }
}
