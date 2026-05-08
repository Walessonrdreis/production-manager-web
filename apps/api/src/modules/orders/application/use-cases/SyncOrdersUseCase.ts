import { OrdersAdapter } from '../../infrastructure/integrations/orders.adapter.js';
import { OrderMapper } from '../mappers/OrderMapper.js';

export class SyncOrdersUseCase {
  static async execute() {
    const rawOrders = await OrdersAdapter.fetchFromExternalAPI(1, 500);
    const formattedOrders = rawOrders.map(OrderMapper.toDomain);
    
    return { count: formattedOrders.length, data: formattedOrders };
  }
}
