import { OrdersAdapter } from '../../infrastructure/integrations/orders.adapter.js';
import { OrderMapper } from '../mappers/OrderMapper.js';
import { legacyPrisma } from '../../../../infra/prisma.js';
import { randomUUID } from 'crypto';

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
        
        await legacyPrisma.order.upsert({
          where: { id: String(orderId) },
          create: { id: String(orderId), data: JSON.stringify(order) },
          update: { data: JSON.stringify(order) }
        });

        // REVERT AUTO-COMPLETION FIX:
        // If the order came back to stage 20 (e.g., moved back by mistake),
        // we remove any automatically generated ProducedRecord entries for it.
        await legacyPrisma.producedRecord.deleteMany({
          where: {
            orderId: String(orderId),
            id: { startsWith: 'auto-' } // Matches records created via obsolete removal logic
          }
        });
      }
      console.log(`[SYNC ORDERS] Successfully saved ${formattedOrders.length} orders to Prisma.`);

      // Process obsolete orders (they left stage 20, meaning they were produced)
      const allOrders = await legacyPrisma.order.findMany({ select: { id: true } });
      const docsToDelete = allOrders.filter(o => !validOrderIds.has(o.id)).map(o => o.id);
      
      if (docsToDelete.length > 0) {
        // Fetch full data of obsolete orders before deleting them
        const obsoleteOrders = await legacyPrisma.order.findMany({
          where: { id: { in: docsToDelete } }
        });

        let movedToHistory = 0;
        for (const obs of obsoleteOrders) {
          try {
            const orderData = JSON.parse(obs.data);
            const items = orderData.items || [];
            const orderIdStr = String(orderData.id);

            for (const item of items) {
              const desc = item.name || item.descricao || 'Produto Desconhecido';
              const qty = Number(item.quantity || item.quantidade || 1);

              // Prevent duplicating manually produced items by checking for existing combination
              const exists = await legacyPrisma.producedRecord.findFirst({
                where: {
                  orderId: orderIdStr,
                  description: desc
                }
              });

              if (!exists) {
                await legacyPrisma.producedRecord.create({
                  data: {
                    id: `auto-${randomUUID()}`,
                    description: desc,
                    quantity: qty,
                    orderId: orderIdStr,
                    orderNumber: String(orderData.order_number),
                    synced: true // Auto-synced from upstream
                    // createdAt and updatedAt get exactly the current time 
                  }
                });
                movedToHistory++;
              }
            }
          } catch (e: any) {
            console.error(`[SYNC ORDERS] Error parsing obsolete order data for history: ${e.message}`);
          }
        }

        if (movedToHistory > 0) {
           console.log(`[SYNC ORDERS] Moved ${movedToHistory} items from obsolete orders to Produced History.`);
        }

        // Finally, remove from local Orders stage 20 cache
        await legacyPrisma.order.deleteMany({
          where: { id: { in: docsToDelete } }
        });
        console.log(`[SYNC ORDERS] Successfully deleted ${docsToDelete.length} obsolete orders from Prisma.`);
      }
    } catch (err: any) {
      console.error('[SYNC ORDERS] Error saving to Prisma:', err.message);
    }
    
    return { count: formattedOrders.length, data: formattedOrders };
  }
}

