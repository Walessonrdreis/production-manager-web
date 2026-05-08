import { OrdersAdapter } from '../../infrastructure/integrations/orders.adapter.js';

export class GetOrdersListUseCase {
  static async execute(params?: any) {
    const data = await OrdersAdapter.fetchOrdersList(params);
    return { data };
  }
}
