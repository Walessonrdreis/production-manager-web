import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Use the specific databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Validates connection to Firestore as per integration guidelines
 */
export async function testFirestoreConnection() {
  try {
    // Attempt to read a dummy document to verify connectivity
    await getDocFromServer(doc(db, 'system', 'connection_test'));
    console.log('[FIREBASE] Connection established successfully.');
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("[FIREBASE] Connectivity issue: client is offline.");
      return { success: false, error: 'Client is offline' };
    }
    console.warn('[FIREBASE] Connection test skipped or failed (expected if rules are tight):', error);
    return { success: false, error };
  }
}

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('[AUTH] Login failed:', error);
    return { success: false, error };
  }
};
