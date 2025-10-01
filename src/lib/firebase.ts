
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

const saveUser = async (user: any) => {
  const userRef = doc(db, 'users', user.id);
  await setDoc(userRef, user, { merge: true });
};

export { db, saveUser };
