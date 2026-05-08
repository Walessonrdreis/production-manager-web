import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  writeBatch,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

/**
 * Standard error handler as per Firebase Integration guidelines
 */
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Result Pattern Response
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generic Firestore Service implementing ADR-001 (Result Pattern)
 */
export class FirestoreService {
  /**
   * Get a single document
   */
  static async getOne<T>(collectionPath: string, id: string): Promise<ServiceResult<T>> {
    try {
      if (id === undefined || id === null) {
        throw new Error(`Cannot get item with missing id from ${collectionPath}`);
      }
      const docRef = doc(db, collectionPath, String(id));
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as T };
      }
      return { success: false, error: 'Document not found' };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${collectionPath}/${id}`);
    }
  }

  /**
   * List documents with optional filters
   */
  static async list<T>(collectionPath: string, constraints: QueryConstraint[] = []): Promise<ServiceResult<T[]>> {
    try {
      const colRef = collection(db, collectionPath);
      const q = query(colRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      
      return { success: true, data: items };
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
    }
  }

  /**
   * Create or Overwrite a document
   */
  static async save<T extends { id: string }>(collectionPath: string, item: T): Promise<ServiceResult<T>> {
    try {
      if (!item || item.id === undefined || item.id === null) {
        throw new Error(`Cannot save item with missing id to ${collectionPath}`);
      }
      const docRef = doc(db, collectionPath, String(item.id));
      
      // Remove undefined values to prevent Firebase errors
      const cleanItem = Object.fromEntries(
        Object.entries({ ...item, updatedAt: new Date().toISOString() }).filter(([_, v]) => v !== undefined)
      );
      
      await setDoc(docRef, cleanItem);
      return { success: true, data: item };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, collectionPath);
    }
  }

  /**
   * Update specific fields of a document
   */
  static async update<T>(collectionPath: string, id: string, data: Partial<T>): Promise<ServiceResult<boolean>> {
    try {
      if (id === undefined || id === null) {
        throw new Error(`Cannot update item with missing id in ${collectionPath}`);
      }
      const docRef = doc(db, collectionPath, String(id));
      
      // Remove undefined values to prevent Firebase errors
      const cleanData = Object.fromEntries(
        Object.entries({ ...data, updatedAt: new Date().toISOString() }).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, cleanData as DocumentData);
      return { success: true, data: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${id}`);
    }
  }

  /**
   * Delete a document
   */
  static async delete(collectionPath: string, id: string): Promise<ServiceResult<boolean>> {
    try {
      if (id === undefined || id === null) {
        throw new Error(`Cannot delete item with missing id from ${collectionPath}`);
      }
      const docRef = doc(db, collectionPath, String(id));
      await deleteDoc(docRef);
      return { success: true, data: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${id}`);
    }
  }

  /**
   * Save multiple items in batches (max 500 per batch)
   */
  static async saveMany<T extends { id: string }>(collectionPath: string, items: T[]): Promise<ServiceResult<boolean>> {
    try {
      const validItems = items.filter(item => item && item.id !== undefined && item.id !== null);
      if (validItems.length < items.length) {
        console.warn(`[FirestoreService] saveMany on ${collectionPath} ignored ${items.length - validItems.length} items due to missing 'id'`);
      }
      if (validItems.length === 0) return { success: true, data: true };

      const chunkSize = 500;
      for (let i = 0; i < validItems.length; i += chunkSize) {
        const chunk = validItems.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        
        for (const item of chunk) {
          const docRef = doc(db, collectionPath, String(item.id));
          const cleanItem = Object.fromEntries(
            Object.entries({ ...item, updatedAt: new Date().toISOString() }).filter(([_, v]) => v !== undefined)
          );
          batch.set(docRef, cleanItem);
        }
        
        await batch.commit();
      }
      return { success: true, data: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, collectionPath);
    }
  }
}
