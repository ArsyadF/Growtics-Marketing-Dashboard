
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Paste isi konfigurasi dari Firebase Console Anda di bawah ini:
const firebaseConfig = {
  apiKey: "AIzaSyAiNjqLaw84Zc28tiFA7ifLQu_nV6S0ioU",
  authDomain: "marketing-ad75c.firebaseapp.com",
  projectId: "marketing-ad75c",
  storageBucket: "marketing-ad75c.firebasestorage.app",
  messagingSenderId: "747898257753",
  appId: "1:747898257753:web:90be7008ffe941396bcc48",
  measurementId: "G-2EH46382V6"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore Database dan ekspor agar bisa dipakai di komponen lain
export const db = getFirestore(app);