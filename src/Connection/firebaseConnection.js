// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAePEFeKR1UriPQ0z8LY8XPAxMxes9AzVE",
  authDomain: "taskertarefas.firebaseapp.com",
  projectId: "taskertarefas",
  storageBucket: "taskertarefas.appspot.com",
  messagingSenderId: "1026540875784",
  appId: "1:1026540875784:web:c557d196e5f3b0b12921bd",
  measurementId: "G-3WF8H7GEBZ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth }
