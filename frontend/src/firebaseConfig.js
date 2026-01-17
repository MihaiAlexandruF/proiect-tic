// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCskESdk6P4m7irLVHwGee-daTd72tSs28",
  authDomain: "proiect-tic-2181e.firebaseapp.com",
  projectId: "proiect-tic-2181e",
  storageBucket: "proiect-tic-2181e.firebasestorage.app",
  messagingSenderId: "373189707433",
  appId: "1:373189707433:web:5da3ef99b10f949ce54bb8",
  measurementId: "G-206J9GDQHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
