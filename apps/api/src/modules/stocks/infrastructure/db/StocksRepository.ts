import { getAdminDb } from '../../../../lib/firebase-admin.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class StocksRepository {
  static async getById(id: string) {
    const db = getAdminDb();
    if (!db) throw new AppError('Database not initialized', 500);
    const doc = await db.collection('stocks').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  static async getAll() {
    const db = getAdminDb();
    if (!db) throw new AppError('Database not initialized', 500);
    const snapshot = await db.collection('stocks').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async save(id: string, data: any) {
    const db = getAdminDb();
    if (!db) throw new AppError('Database not initialized', 500);
    await db.collection('stocks').doc(id).set(data, { merge: true });
    return { id, ...data };
  }

  static async delete(id: string) {
    const db = getAdminDb();
    if (!db) throw new AppError('Database not initialized', 500);
    await db.collection('stocks').doc(id).delete();
  }
}
