import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { readFileSync } from 'fs';
import path from 'path';

// Read config dynamically to avoid TypeScript issues with JSON imports outside rootDir
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(readFileSync(configPath, 'utf8'));

const app = initializeApp(firebaseConfig);

// CRITICAL: Use the specific databaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
