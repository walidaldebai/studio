
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

let app: FirebaseApp;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

const db: Firestore = getFirestore(app);

const saveUser = async (user: any) => {
  if (!user || !user.id) {
    console.error("User or User ID is missing. Cannot save user.");
    return;
  }
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, user, { merge: true });
  } catch (error) {
    console.error("Error saving user to Firestore: ", error);
  }
};

export { db, saveUser };
