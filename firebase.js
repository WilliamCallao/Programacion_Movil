// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

export { db };
