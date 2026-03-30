// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjW0gxckx3NztiotF5RCjWrNITcBOih8g",
  authDomain: "chatx-ds.firebaseapp.com",
  projectId: "chatx-ds",
  storageBucket: "chatx-ds.firebasestorage.app",
  messagingSenderId: "192052075706",
  appId: "1:192052075706:web:534dae8107591afa81b683",
  measurementId: "G-MZJHM6G8QT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);

export {auth}