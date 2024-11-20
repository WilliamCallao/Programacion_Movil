// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC3AA1wdgDW_Jx2pSF36KZg6ibkwQ9sFao",
  authDomain: "app-programacion-movil.firebaseapp.com",
  projectId: "app-programacion-movil",
  storageBucket: "app-programacion-movil.appspot.com",
  messagingSenderId: "795701211483",
  appId: "1:795701211483:web:dc01a758911a5f11f72a7e",
  measurementId: "G-3J7NMVGJ9N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, db };
