// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZXLkHSPdq0uAAArWfQxQTgcEVuXQj65M",
  authDomain: "cs641-827ca.firebaseapp.com",
  projectId: "cs641-827ca",
  storageBucket: "cs641-827ca.appspot.com",
  messagingSenderId: "757809731799",
  appId: "1:757809731799:web:834ee31fb57efa30507892",
  measurementId: "G-TBWGSVGNP5" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const storage = getStorage(app);

// Function to ensure the user document exists
export const ensureUserDocument = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          displayName: user.email.split("@")[0], 
          avatarUrl: "",
          email: user.email,
        });
        console.log("User document created.");
      }
    }
  } catch (error) {
    console.error("Error ensuring user document:", error);
  }
};