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
      const docRef = doc(db, collectionPath, id);
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
      const docRef = doc(db, collectionPath, item.id);
      await setDoc(docRef, { ...item, updatedAt: new Date().toISOString() });
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
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() } as DocumentData);
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
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
      return { success: true, data: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${id}`);
    }
  }
}
