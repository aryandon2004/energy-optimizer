
// frontend/src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔥 Replace with your REAL Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCSIN2-GDDP_mpaKmxG-tbfluZf1vIkRm8",
  authDomain: "energy-optimizer-72c6f.firebaseapp.com",
  projectId: "energy-optimizer-72c6f",
  storageBucket: "energy-optimizer-72c6f.firebasestorage.app",
  messagingSenderId: "963830132028",
  appId: "1:963830132028:web:9d9b1efa0da63db207c239",
   measurementId: "G-TW9BEPP4QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ THIS LINE IS VERY IMPORTANT
const db = getFirestore(app);

// ✅ EXPORT db (THIS WAS MISSING)
export { db };