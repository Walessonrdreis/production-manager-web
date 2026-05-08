import { ClientsAdapter } from '../../infrastructure/integrations/clients.adapter.js';
import { getAdminDb } from '../../../../lib/firebase-admin.js';

export class SyncClientsUseCase {
  static async execute(page: number = 1, pageSize: number = 5000) {
    const clients = await ClientsAdapter.fetchFromExternalAPI(page, pageSize);
    
    // Save to Firebase Admin
    try {
      const db = getAdminDb();
      if (db) {
        const batch = db.batch();
        for (const client of clients) {
          const clientId = client.omieCode || client.codigo_cliente_omie;
          if (!clientId) continue;
          
          const docRef = db.collection('customers').doc(String(clientId));
          batch.set(docRef, { ...client, updatedAt: new Date().toISOString() }, { merge: true });
        }
        await batch.commit();
        console.log(`[SYNC CLIENTS] Successfully saved ${clients.length} clients to Firebase.`);
      }
    } catch (err: any) {
      console.error('[SYNC CLIENTS] Error saving to Firebase:', err.message);
    }
    
    return { count: clients.length, data: clients };
  }
}

