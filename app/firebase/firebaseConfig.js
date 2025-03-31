// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// // 🔥 Paste your Firebase config here
// const firebaseConfig = {
//     apiKey: "AIzaSyCfLLeZptpy-zq48KjnIgOmBYRFAEBEJh4",
//     authDomain: "x-itos.firebaseapp.com",
//     projectId: "x-itos",
//     storageBucket: "x-itos.firebasestorage.app",
//     messagingSenderId: "591147532340",
//     appId: "1:591147532340:web:c13d57ee7073d863b3ca61",
//     measurementId: "G-RBVQ28LD7P"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };


import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCfLLeZptpy-zq48KjnIgOmBYRFAEBEJh4",
  authDomain: "x-itos.firebaseapp.com",
  projectId: "x-itos",
  storageBucket: "x-itos.appspot.com",
  messagingSenderId: "591147532340",
  appId: "1:591147532340",
  measurementId: "G-RBVQ28LD7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);  // Initialize Firebase Authentication

export { db, auth };
