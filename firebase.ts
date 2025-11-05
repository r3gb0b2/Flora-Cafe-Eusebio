import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// IMPORTANT: Replace with your web app's Firebase configuration.
// You can get this from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyDsi6VpfhLQW8UWgAp5c4TRV7vqOkDyauU",
  authDomain: "stingressos-e0a5f.firebaseapp.com",
  projectId: "stingressos-e0a5f",
  storageBucket: "stingressos-e0a5f.firebasestorage.app",
  messagingSenderId: "424186734009",
  appId: "1:424186734009:web:c4f601ce043761cd784268",
  measurementId: "G-M30E0D9TP2"
};

// A simple check to see if the config is still using placeholder values.
export const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyCI1FJC9lFcUOGazyowYlsdZnTRKRItsGY";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { db, auth, storage };
