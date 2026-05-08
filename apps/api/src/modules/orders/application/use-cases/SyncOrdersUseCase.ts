import { OrdersAdapter } from '../../infrastructure/integrations/orders.adapter.js';
import { OrderMapper } from '../mappers/OrderMapper.js';
import { getAdminDb } from '../../../../lib/firebase-admin.js';

export class SyncOrdersUseCase {
  static async execute(page: number = 1, pageSize: number = 200) {
    const rawOrders = await OrdersAdapter.fetchFromExternalAPI(page, pageSize);
    const formattedOrders = rawOrders.map(OrderMapper.toDomain);
    
    // Save to Firebase Admin
    try {
      const db = getAdminDb();
      if (db) {
        const batch = db.batch();
        for (const order of formattedOrders) {
          const orderId = order.id || order.omieCode || order.codigo_pedido;
          if (!orderId) continue;
          
          const docRef = db.collection('orders').doc(String(orderId));
          batch.set(docRef, { ...order, updatedAt: new Date().toISOString() }, { merge: true });
        }
        await batch.commit();
        console.log(`[SYNC ORDERS] Successfully saved ${formattedOrders.length} orders to Firebase.`);
      }
    } catch (err: any) {
      console.error('[SYNC ORDERS] Error saving to Firebase:', err.message);
    }
    
    return { count: formattedOrders.length, data: formattedOrders };
  }
}

