import { initializeApp, getApps, cert, applicationDefault, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { AppError } from '../shared/errors/AppError.js';
import path from 'path';
import { readFileSync, existsSync } from 'fs';

let config: any;

const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
if (existsSync(configPath)) {
  const fileContent = readFileSync(configPath, 'utf8');
  config = JSON.parse(fileContent);
}

let isInitialized = false;

function initFirebaseAdmin() {
  if (isInitialized) return;
  if (getApps().length) {
    isInitialized = true;
    return;
  }
  
  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || config?.projectId;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || `firebase-adminsdk-fbsvc@${projectId}.iam.gserviceaccount.com`;
    let rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
      rawKey = rawKey.slice(1, -1);
    }
    const privateKey = rawKey.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
        // Fallback for Application Default Credentials (e.g. if deployed in GCP)
        initializeApp({
            credential: applicationDefault(),
            projectId,
        });
    }
    isInitialized = true;
  } catch (err: any) {
    console.error('Firebase Admin Init Error:', err);
    throw new AppError(`Failed to initialize Firebase Admin: ${err.message}. Certifique-se de configurar as variáveis FIREBASE_PRIVATE_KEY e FIREBASE_CLIENT_EMAIL no .env`, 500);
  }
}

let dbInstance: Firestore | null = null;

export const getAdminDb = (): Firestore => {
  initFirebaseAdmin();
  if (!dbInstance) {
    const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || config?.firestoreDatabaseId;
    try {
      dbInstance = dbId 
        ? getFirestore(getApp(), dbId)
        : getFirestore(getApp());
    } catch(e) {
      dbInstance = getFirestore();
    }
  }
  return dbInstance;
};
