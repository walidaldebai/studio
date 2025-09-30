
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'studio-8438523234-c4061',
  appId: '1:992007136057:web:baa81002a224c229e3bee8',
  apiKey: 'AIzaSyDXFrSq5NeGdxUsAU2B4c16ZA1qVSBO0oQ',
  authDomain: 'studio-8438523234-c4061.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '992007136057',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
