// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd05-5HTnInkv45OQgHc4BrfHbIzAEFaE",
  authDomain: "sportswebsite-25428.firebaseapp.com",
  projectId: "sportswebsite-25428",
  storageBucket: "sportswebsite-25428.firebasestorage.app",
  messagingSenderId: "597900541756",
  appId: "1:597900541756:web:c3f7f6fb10474f547c2839",
  measurementId: "G-LL0YY8KR9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;