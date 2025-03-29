import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase config
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

export { db };
