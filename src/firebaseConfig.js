import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlOWk4gNO_a-PaxsKxI67y0wKwbJdiis8",
    authDomain: "attenai-62474.firebaseapp.com",
    projectId: "attenai-62474",
    storageBucket: "attenai-62474.firebasestorage.app",
    messagingSenderId: "675795566451",
    appId: "1:675795566451:web:6dd75fd2b7a6b6d1154f06",
    measurementId: "G-Y7FVWK01FY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firestore
const auth = getAuth(app);    // Authentication

export { db, auth };
