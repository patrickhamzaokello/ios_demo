// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {initializeAuth, getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNZZFNUrVHO4zohM-MhOXfVxgqvvF0-uo",
  authDomain: "faithfellowapp.firebaseapp.com",
  projectId: "faithfellowapp",
  storageBucket: "faithfellowapp.firebasestorage.app",
  messagingSenderId: "300402759232",
  appId: "1:300402759232:web:75505cb6ad9b68bfb231a5",
  measurementId: "G-X4FF5FBFE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})

// db
export const firestore = getFirestore(app)