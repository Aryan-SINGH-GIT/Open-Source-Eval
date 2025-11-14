import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRn7eg72mD7MUTldmrbvi36DRHtfwpZaA",
  authDomain: "login-page-1026a.firebaseapp.com",
  projectId: "login-page-1026a",
  storageBucket: "login-page-1026a.firebasestorage.app",
  messagingSenderId: "349283384382",
  appId: "1:349283384382:web:8fb6a5bd4412720217e56f",
  measurementId: "G-V0Q96HJS1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth} 