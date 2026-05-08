import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ProductionGoal } from '../domain/Goal';

export const FirebaseGoalsRepository = {
  COLLECTION: 'goals',

  async getAll(): Promise<{ success: boolean; data?: ProductionGoal[] }> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTION));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductionGoal));
      return { success: true, data };
    } catch (error: any) {
      console.error('Firebase read error:', error);
      return { success: false };
    }
  },

  async save(goal: ProductionGoal): Promise<{ success: boolean }> {
    try {
      if (!goal.id) return { success: false };
      await setDoc(doc(db, this.COLLECTION, goal.id), goal);
      return { success: true };
    } catch (error: any) {
      console.error('Firebase save error:', error);
      return { success: false };
    }
  },

  async update(id: string, goal: Partial<ProductionGoal>): Promise<{ success: boolean }> {
    try {
      await updateDoc(doc(db, this.COLLECTION, id), goal);
      return { success: true };
    } catch (error: any) {
      console.error('Firebase update error:', error);
      return { success: false };
    }
  },

  async delete(id: string): Promise<{ success: boolean }> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, id));
      return { success: true };
    } catch (error: any) {
      console.error('Firebase delete error:', error);
      return { success: false };
    }
  }
};
