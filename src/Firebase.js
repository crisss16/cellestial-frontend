// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore"; 

// 1. Configurarea aplicației tale
const firebaseConfig = {
  apiKey: "AIzaSyCTGKVOm3ix-T6zva_euAHyeXUYKo1bL-Q",
  authDomain: "cellestial-site.firebaseapp.com",
  projectId: "cellestial-site",
  messagingSenderId: "212008792078",
  appId: "1:212008792078:web:3e85cb600803d7df674c5f",
};

// 2. Inițializează Firebase mai întâi (IMPORTANT!)
const app = initializeApp(firebaseConfig);

// 3. Inițializează Firestore cu setarea de Long Polling pentru a scăpa de erorile de rețea
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, 
});

// 4. Inițializează celelalte servicii
export const auth = getAuth(app);
export const storage = getStorage(app);