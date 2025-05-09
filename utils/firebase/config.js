import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAPkcxVLlfL9F1RYevSRDvyF-1jd1SP7cc",
  authDomain: "toomiia.firebaseapp.com",
  projectId: "toomiia",
  storageBucket: "toomiia.firebasestorage.app",
  messagingSenderId: "543194296268",
  appId: "1:543194296268:web:81ae1ae36a6b52a8037769",
  measurementId: "G-15DVLM61R0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
