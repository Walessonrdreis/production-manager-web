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
        const chunkSize = 400;
        const validOrderIds = new Set<string>();

        // Upsert fetched orders
        for (let i = 0; i < formattedOrders.length; i += chunkSize) {
          const chunk = formattedOrders.slice(i, i + chunkSize);
          const batch = db.batch();
          for (const order of chunk) {
            const orderId = order.id || (order as any).omieCode || (order as any).codigo_pedido;
            if (!orderId) continue;
            validOrderIds.add(String(orderId));
            
            const docRef = db.collection('orders').doc(String(orderId));
            batch.set(docRef, { ...order, updatedAt: new Date().toISOString() }, { merge: true });
          }
          await batch.commit();
        }
        console.log(`[SYNC ORDERS] Successfully saved ${formattedOrders.length} orders to Firebase.`);

        // Delete obsolete orders
        if (validOrderIds.size > 0) {
          const snapshot = await db.collection('orders').get();
          const docsToDelete: string[] = [];
          
          snapshot.forEach(doc => {
            if (!validOrderIds.has(doc.id)) {
              docsToDelete.push(doc.id);
            }
          });

          if (docsToDelete.length > 0) {
            for (let i = 0; i < docsToDelete.length; i += chunkSize) {
              const deleteChunk = docsToDelete.slice(i, i + chunkSize);
              const deleteBatch = db.batch();
              for (const id of deleteChunk) {
                const docRef = db.collection('orders').doc(id);
                deleteBatch.delete(docRef);
              }
              await deleteBatch.commit();
            }
            console.log(`[SYNC ORDERS] Successfully deleted ${docsToDelete.length} obsolete orders from Firebase.`);
          }
        }
      }
    } catch (err: any) {
      console.error('[SYNC ORDERS] Error saving to Firebase:', err.message);
    }
    
    return { count: formattedOrders.length, data: formattedOrders };
  }
}

