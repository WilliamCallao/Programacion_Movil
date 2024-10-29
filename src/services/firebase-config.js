// services/firebase-config.js
// import { initializeApp, getApps } from "firebase/app";
// import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyBiesNVEmAxT4TPbPrQylUu5lL2vX003JY",
//   authDomain: "plan-nutricional-4891a.firebaseapp.com",
//   projectId: "plan-nutricional-4891a",
//   storageBucket: "plan-nutricional-4891a.appspot.com",
//   messagingSenderId: "582293669144",
//   appId: "1:582293669144:web:6fd1121aef24e664554a6d"
// };

// let app;
// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApps()[0];
// }

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

// export { auth };