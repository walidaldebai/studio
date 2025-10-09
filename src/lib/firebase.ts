
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

let app: FirebaseApp;
let db: Firestore;

function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
}

// Initialize on first load
if (typeof window !== 'undefined') {
  initializeFirebase();
}


const getDb = (): Firestore => {
    if (!db) {
        initializeFirebase();
    }
    return db;
}


const saveUser = async (user: any) => {
  if (!user || !user.id) {
    console.error("User or User ID is missing. Cannot save user.");
    return;
  }
  try {
    const firestore = getDb();
    const userRef = doc(firestore, 'users', user.id);
    await setDoc(userRef, user, { merge: true });
  } catch (error) {
    console.error("Error saving user to Firestore: ", error);
  }
};

export { getDb, saveUser };
