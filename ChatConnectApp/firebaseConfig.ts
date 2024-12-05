// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZXLkHSPdq0uAAArWfQxQTgcEVuXQj65M",
  authDomain: "cs641-827ca.firebaseapp.com",
  projectId: "cs641-827ca",
  storageBucket: "cs641-827ca.appspot.com", // Corrected storageBucket URL
  messagingSenderId: "757809731799",
  appId: "1:757809731799:web:834ee31fb57efa30507892",
  measurementId: "G-TBWGSVGNP5" // You can remove this if analytics is not used
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Firebase Auth instance
export const db = getFirestore(app); // Export Firestore