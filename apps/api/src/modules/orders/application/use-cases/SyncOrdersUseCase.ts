import { OrdersAdapter } from '../../infrastructure/integrations/orders.adapter.js';
import { OrderMapper } from '../mappers/OrderMapper.js';
import { prisma } from '../../../../infra/prisma.js';

export class SyncOrdersUseCase {
  static async execute(page: number = 1, pageSize: number = 200) {
    const rawOrders = await OrdersAdapter.fetchFromExternalAPI(page, pageSize);
    const formattedOrders = rawOrders.map(OrderMapper.toDomain);
    
    // Save to Prisma
    try {
      const validOrderIds = new Set<string>();

      // Upsert fetched orders
      for (const order of formattedOrders) {
        const orderId = order.id || (order as any).omieCode || (order as any).codigo_pedido;
        if (!orderId) continue;
        validOrderIds.add(String(orderId));
        
        await prisma.order.upsert({
          where: { id: String(orderId) },
          create: { id: String(orderId), data: JSON.stringify(order) },
          update: { data: JSON.stringify(order) }
        });
      }
      console.log(`[SYNC ORDERS] Successfully saved ${formattedOrders.length} orders to Prisma.`);

      // Delete obsolete orders
      if (validOrderIds.size > 0) {
        const allOrders = await prisma.order.findMany({ select: { id: true } });
        const docsToDelete = allOrders.filter(o => !validOrderIds.has(o.id)).map(o => o.id);
        
        if (docsToDelete.length > 0) {
          await prisma.order.deleteMany({
            where: { id: { in: docsToDelete } }
          });
          console.log(`[SYNC ORDERS] Successfully deleted ${docsToDelete.length} obsolete orders from Prisma.`);
        }
      }
    } catch (err: any) {
      console.error('[SYNC ORDERS] Error saving to Prisma:', err.message);
    }
    
    return { count: formattedOrders.length, data: formattedOrders };
  }
}

