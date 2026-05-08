import { OrdersAdapter } from '../../infrastructure/integrations/orders.adapter.js';
import { OrderMapper } from '../mappers/OrderMapper.js';

export class SyncOrdersUseCase {
  static async execute(page: number = 1, pageSize: number = 500) {
    const rawOrders = await OrdersAdapter.fetchFromExternalAPI(page, pageSize);
    const formattedOrders = rawOrders.map(OrderMapper.toDomain);
    
    return { count: formattedOrders.length, data: formattedOrders };
  }
}
