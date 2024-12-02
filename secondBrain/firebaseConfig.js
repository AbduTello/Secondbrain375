// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1hR5tzEW3FKma4kelMI4D3N98qHCLPcY",
  authDomain: "secondbrain375.firebaseapp.com",
  projectId: "secondbrain375",
  storageBucket: "secondbrain375.firebasestorage.app",
  messagingSenderId: "502895539890",
  appId: "1:502895539890:web:67a1dbbae061763d9b7bab",
  measurementId: "G-H5Z9TQVTFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);