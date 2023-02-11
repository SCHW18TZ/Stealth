// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCPAMEqC7Dc9IhDJoyew7hBZkEaN8f4q0k",
  authDomain: "stealth-web.firebaseapp.com",
  projectId: "stealth-web",
  storageBucket: "stealth-web.appspot.com",
  messagingSenderId: "536544237762",
  appId: "1:536544237762:web:823965effa0f964908435b",
  measurementId: "G-30GM9W7CWF",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
