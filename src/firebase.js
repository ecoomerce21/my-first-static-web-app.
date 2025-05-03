// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlW22meA04xGX8R6vXXZj1_RpSt0OAK4M",
  authDomain: "staticwebapp-7ebc3.firebaseapp.com",
  projectId: "staticwebapp-7ebc3",
  storageBucket: "staticwebapp-7ebc3.appspot.com", // ✅ correct the domain from `.app` to `.appspot.com`
  messagingSenderId: "215394666440",
  appId: "1:215394666440:web:f2d68055211b5bff72e2fd",
  measurementId: "G-N62L2P9W6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth and Firestore DB
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
