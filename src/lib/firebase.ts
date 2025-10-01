
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, onSnapshot, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-8438523234-c4061',
  appId: '1:992007136057:web:baa81002a224c229e3bee8',
  apiKey: 'AIzaSyDXFrSq5NeGdxUsAU2B4c16ZA1qVSBO0oQ',
  authDomain: 'studio-8438523234-c4061.firebaseapp.com',
  storageBucket: 'studio-8438523234-c4061.appspot.com',
  messagingSenderId: '992007136057',
  measurementId: 'G-3FGERJ3X8E'
};

let app: FirebaseApp;
let db: Firestore;

function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    app = getApps()[0];
    db = getFirestore(app);
  }
  return { app, db };
}

const saveUser = async (user: any) => {
  const { db } = initializeFirebase();
  if (!user || !user.id) return;
  const userRef = doc(db, 'users', user.id);
  await setDoc(userRef, user, { merge: true });
};

const onUsersSnapshot = (callback: (users: any[]) => void) => {
  const { db } = initializeFirebase();
  const usersCollection = collection(db, 'users');
  return onSnapshot(usersCollection, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  });
};

export { initializeFirebase, saveUser, onUsersSnapshot, db };
