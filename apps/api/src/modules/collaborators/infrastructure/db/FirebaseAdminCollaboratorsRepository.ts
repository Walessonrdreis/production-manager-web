import { getAdminDb } from '../../../../lib/firebase-admin.js';
import { AppError } from '../../../../shared/errors/AppError.js';
import { v4 as uuidv4 } from 'uuid';

export class FirebaseAdminCollaboratorsRepository {
  private static COLLECTION = 'collaborators';

  static async getAll() {
    try {
      const snapshot = await getAdminDb().collection(this.COLLECTION).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err: any) {
      throw new AppError(`Failed to fetch collaborators from Firebase Admin: ${err.message}`, 500);
    }
  }

  static async getById(id: string) {
    try {
      const docRef = await getAdminDb().collection(this.COLLECTION).doc(id).get();
      if (!docRef.exists) return null;
      return { id: docRef.id, ...docRef.data() };
    } catch (err: any) {
      throw new AppError(`Failed to fetch collaborator from Firebase Admin: ${err.message}`, 500);
    }
  }

  static async save(collaborator: any) {
    try {
      const id = collaborator.id || uuidv4();
      const payload = { 
        ...collaborator, 
        id, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await getAdminDb().collection(this.COLLECTION).doc(id).set(payload);
      return payload;
    } catch (err: any) {
      throw new AppError(`Failed to save collaborator to Firebase Admin: ${err.message}`, 500);
    }
  }

  static async update(id: string, collaborator: any) {
    try {
      const docRef = getAdminDb().collection(this.COLLECTION).doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) throw new AppError('Collaborator not found', 404);

      const updateData = {
        ...collaborator,
        updatedAt: new Date().toISOString()
      };
      
      await docRef.update(updateData);
      return { id, ...snapshot.data(), ...updateData };
    } catch (err: any) {
      throw new AppError(`Failed to update collaborator in Firebase Admin: ${err.message}`, 500);
    }
  }

  static async delete(id: string) {
    try {
      await getAdminDb().collection(this.COLLECTION).doc(id).delete();
    } catch (err: any) {
      throw new AppError(`Failed to delete collaborator from Firebase Admin: ${err.message}`, 500);
    }
  }
}
