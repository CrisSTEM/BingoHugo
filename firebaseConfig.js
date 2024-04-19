// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, createUserWithEmailAndPassword, signOut, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
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

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage(app);

export { auth, createUserWithEmailAndPassword, storage, signOut };
