// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, createUserWithEmailAndPassword, signOut, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKpvUCcugy4UMMBg9VgfmBS1Hse_ER7AA",
  authDomain: "hugobingo-f3cdd.firebaseapp.com",
  projectId: "hugobingo-f3cdd",
  storageBucket: "hugobingo-f3cdd.appspot.com",
  messagingSenderId: "24097937109",
  appId: "1:24097937109:web:497a66835201359f40745c",
  measurementId: "G-32VDSNPZQK",
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa el auth con la persistencia de React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Inicializa otros servicios
const storage = getStorage(app);
const firestore = getFirestore(app);

export { auth, createUserWithEmailAndPassword, storage, signOut, firestore };
