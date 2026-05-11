import { ProductsAdapter } from '../../infrastructure/integrations/catalog.adapter.js';
import { getAdminDb } from '../../../../lib/firebase-admin.js';

export class SyncCatalogUseCase {
  static async execute(limit: number = 1000) {
    const products = await ProductsAdapter.fetchFromExternalAPI(limit);
    
    // Save to Firebase Admin
    try {
      const db = getAdminDb();
      if (db) {
        const chunkSize = 400;
        const validProductIds = new Set<string>();

        // Upsert fetched products
        for (let i = 0; i < products.length; i += chunkSize) {
          const chunk = products.slice(i, i + chunkSize);
          const batch = db.batch();
          for (const product of chunk) {
            const productId = product.codigo || product.codigo_produto;
            if (!productId) continue;
            validProductIds.add(String(productId));
            
            const docRef = db.collection('catalog').doc(String(productId));
            batch.set(docRef, { ...product, updatedAt: new Date().toISOString() }, { merge: true });
          }
          await batch.commit();
        }
        console.log(`[SYNC CATALOG] Successfully saved ${products.length} catalog items to Firebase.`);

        // Delete obsolete products
        if (validProductIds.size > 0) {
          const snapshot = await db.collection('catalog').get();
          const docsToDelete: string[] = [];
          
          snapshot.forEach(doc => {
            if (!validProductIds.has(doc.id)) {
              docsToDelete.push(doc.id);
            }
          });

          if (docsToDelete.length > 0) {
            for (let i = 0; i < docsToDelete.length; i += chunkSize) {
              const deleteChunk = docsToDelete.slice(i, i + chunkSize);
              const deleteBatch = db.batch();
              for (const id of deleteChunk) {
                const docRef = db.collection('catalog').doc(id);
                deleteBatch.delete(docRef);
              }
              await deleteBatch.commit();
            }
            console.log(`[SYNC CATALOG] Successfully deleted ${docsToDelete.length} obsolete items from Firebase.`);
          }
        }
      }
    } catch (err: any) {
      console.error('[SYNC CATALOG] Error saving to Firebase:', err.message);
    }

    return { count: products.length, data: products };
  }
}
