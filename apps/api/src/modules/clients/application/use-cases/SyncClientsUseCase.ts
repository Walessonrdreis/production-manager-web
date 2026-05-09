import { ClientsAdapter } from '../../infrastructure/integrations/clients.adapter.js';
import { getAdminDb } from '../../../../lib/firebase-admin.js';

export class SyncClientsUseCase {
  static async execute(page: number = 1, pageSize: number = 5000) {
    const clients = await ClientsAdapter.fetchFromExternalAPI(page, pageSize);
    
    // Save to Firebase Admin
    try {
      const db = getAdminDb();
      if (db) {
        const chunkSize = 400;
        const validClientIds = new Set<string>();

        // Upsert fetched clients
        for (let i = 0; i < clients.length; i += chunkSize) {
          const chunk = clients.slice(i, i + chunkSize);
          const batch = db.batch();
          for (const client of chunk) {
            const clientId = client.omieCode || client.codigo_cliente_omie;
            if (!clientId) continue;
            validClientIds.add(String(clientId));
            
            const docRef = db.collection('customers').doc(String(clientId));
            batch.set(docRef, { ...client, updatedAt: new Date().toISOString() }, { merge: true });
          }
          await batch.commit();
        }
        console.log(`[SYNC CLIENTS] Successfully saved ${clients.length} clients to Firebase.`);

        // Delete obsolete clients
        if (validClientIds.size > 0) {
          const snapshot = await db.collection('customers').get();
          const docsToDelete: string[] = [];
          
          snapshot.forEach(doc => {
            if (!validClientIds.has(doc.id)) {
              docsToDelete.push(doc.id);
            }
          });

          if (docsToDelete.length > 0) {
            for (let i = 0; i < docsToDelete.length; i += chunkSize) {
              const deleteChunk = docsToDelete.slice(i, i + chunkSize);
              const deleteBatch = db.batch();
              for (const id of deleteChunk) {
                const docRef = db.collection('customers').doc(id);
                deleteBatch.delete(docRef);
              }
              await deleteBatch.commit();
            }
            console.log(`[SYNC CLIENTS] Successfully deleted ${docsToDelete.length} obsolete clients from Firebase.`);
          }
        }
      }
    } catch (err: any) {
      console.error('[SYNC CLIENTS] Error saving to Firebase:', err.message);
    }
    
    return { count: clients.length, data: clients };
  }
}

