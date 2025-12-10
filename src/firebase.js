// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 🔹 Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwFS91Nd8qWp9IMY4_6LtD13NNzXXKAD0",
  authDomain: "invoice-manager-935fd.firebaseapp.com",
  projectId: "invoice-manager-935fd",
  storageBucket: "invoice-manager-935fd.firebasestorage.app",
  messagingSenderId: "139343126218",
  appId: "1:139343126218:web:2b12689308ce3f95801e33",
  measurementId: "G-4NGVXH2QE8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔹 Initialize Firestore and export it
export const db = getFirestore(app);
