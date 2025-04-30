// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import Constants from 'expo-constants';

// Config for Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPkcxVLlfL9F1RYevSRDvyF-1jd1SP7cc",
    authDomain: "toomiia.firebaseapp.com", // <-- كمان هنا كانت غلط، لازم firebaseapp.com مش firebasestorage.app
    projectId: "toomiia",
    storageBucket: "toomiia.firebasestorage.com", // <-- وهنا برضو صححتلك
    messagingSenderId: "543194296268",
    appId: "1:543194296268:web:81ae1ae36a6b52a8037769",
    measurementId: "G-15DVLM61R0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Export firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
