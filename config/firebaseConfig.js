// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, createUserWithEmailAndPassword, signOut, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage(app);
const firestore = getFirestore(app);
export { auth, createUserWithEmailAndPassword, storage, signOut, firestore };
