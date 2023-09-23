// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_TemJPds6CubkeqwFB552cRLXIvc2yEE",
  authDomain: "rita-chat-8d114.firebaseapp.com",
  projectId: "rita-chat-8d114",
  storageBucket: "rita-chat-8d114.appspot.com",
  messagingSenderId: "924164922366",
  appId: "1:924164922366:web:6668a9ed7c99f0ba457eaf",
  measurementId: "G-2EVVZ3EW45"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore();

// const analytics = getAnalytics(app);