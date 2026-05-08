import { ProductsAdapter } from '../../infrastructure/integrations/products.adapter.js';
import { getAdminDb } from '../../../../lib/firebase-admin.js';

export class SyncProductsUseCase {
  static async execute(limit: number = 1000) {
    const products = await ProductsAdapter.fetchFromExternalAPI(limit);
    
    // Save to Firebase Admin
    try {
      const db = getAdminDb();
      if (db) {
        const batch = db.batch();
        for (const product of products) {
          const productId = product.codigo || product.codigo_produto;
          if (!productId) continue;
          
          const docRef = db.collection('products').doc(String(productId));
          batch.set(docRef, { ...product, updatedAt: new Date().toISOString() }, { merge: true });
        }
        await batch.commit();
        console.log(`[SYNC PRODUCTS] Successfully saved ${products.length} products to Firebase.`);
      }
    } catch (err: any) {
      console.error('[SYNC PRODUCTS] Error saving to Firebase:', err.message);
    }

    return { count: products.length, data: products };
  }
}

