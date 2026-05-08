import { getAdminDb } from '../../../../lib/firebase-admin.js';
import { AppError } from '../../../../shared/errors/AppError.js';
import { v4 as uuidv4 } from 'uuid';

export class FirebaseAdminGoalsRepository {
  private static COLLECTION = 'goals';

  static async getAll() {
    try {
      const snapshot = await getAdminDb().collection(this.COLLECTION).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err: any) {
      throw new AppError(`Failed to fetch goals from Firebase Admin: ${err.message}`, 500);
    }
  }

  static async getById(id: string) {
    try {
      const docRef = await getAdminDb().collection(this.COLLECTION).doc(id).get();
      if (!docRef.exists) return null;
      return { id: docRef.id, ...docRef.data() };
    } catch (err: any) {
      throw new AppError(`Failed to fetch goal from Firebase Admin: ${err.message}`, 500);
    }
  }

  static async save(goal: any) {
    try {
      const id = goal.id || uuidv4();
      const goalToSave = { ...goal, id };
      await getAdminDb().collection(this.COLLECTION).doc(id).set(goalToSave);
      return goalToSave;
    } catch (err: any) {
      throw new AppError(`Failed to save goal to Firebase Admin: ${err.message}`, 500);
    }
  }

  static async update(id: string, goal: any) {
    try {
      // Get existing first because Firestore update fails if doc doesn't exist
      const docRef = getAdminDb().collection(this.COLLECTION).doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) throw new AppError('Goal not found', 404);

      await docRef.update(goal);
      return { id, ...goal };
    } catch (err: any) {
      throw new AppError(`Failed to update goal in Firebase Admin: ${err.message}`, 500);
    }
  }

  static async delete(id: string) {
    try {
      await getAdminDb().collection(this.COLLECTION).doc(id).delete();
    } catch (err: any) {
      throw new AppError(`Failed to delete goal from Firebase Admin: ${err.message}`, 500);
    }
  }
}
