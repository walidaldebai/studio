
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-8438523234-c4061',
  appId: '1:992007136057:web:baa81002a224c229e3bee8',
  apiKey: 'AIzaSyDXFrSq5NeGdxUsAU2B4c16ZA1qVSBO0oQ',
  authDomain: 'studio-8438523234-c4061.firebaseapp.com',
  storageBucket: 'studio-8438523234-c4061.appspot.com',
  messagingSenderId: '992007136057',
  measurementId: 'G-3FGERJ3X8E'
};

function initializeFirebase(): { app: FirebaseApp; db: Firestore; } {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return { app, db };
  } else {
    const app = getApps()[0];
    const db = getFirestore(app);
    return { app, db };
  }
}

const saveUser = async (db: Firestore, user: any) => {
  if (!user || !user.id) return;
  const userRef = doc(db, 'users', user.id);
  await setDoc(userRef, user, { merge: true });
};


export { initializeFirebase, saveUser };
