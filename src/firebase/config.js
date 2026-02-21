import { initializeApp } from 'firebase/app';
import { getFirestore }  from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKqxlsITfIUMFu0W3eo-6Wtt0db3M0EKI",
  authDomain: "luxegrid-8731b.firebaseapp.com",
  projectId: "luxegrid-8731b",
  storageBucket: "luxegrid-8731b.firebasestorage.app",
  messagingSenderId: "495714564316",
  appId: "1:495714564316:web:8586ac13cfccb498961c19",
  measurementId: "G-GBG7F0ME6S"
};
const app       = initializeApp(firebaseConfig);
export const db = getFirestore(app);
