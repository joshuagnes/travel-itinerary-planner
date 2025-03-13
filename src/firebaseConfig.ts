// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCffFC-_ff2NupWP98JwiRiSLXTs6FSPfI",
  authDomain: "project-1-cfdc5.firebaseapp.com",
  projectId: "project-1-cfdc5",
  storageBucket: "project-1-cfdc5.firebasestorage.app",
  messagingSenderId: "976154369397",
  appId: "1:976154369397:web:0a5a525ba53d4fd16e473c",
  measurementId: "G-WKP2P1PMQS"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const tripsCollection = collection(db, "trips");
export const destCollection = collection(db, "destinations"); 