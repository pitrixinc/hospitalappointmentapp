// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyBc-UYiH56mFMKYhstfeJkQTYLzUBIg--k",
    authDomain: "hospitalappointment-487e9.firebaseapp.com",
    projectId: "hospitalappointment-487e9",
    storageBucket: "hospitalappointment-487e9.appspot.com",
    messagingSenderId: "1018758930730",
    appId: "1:1018758930730:web:2eadccc2a25e7d53ffbe53"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
