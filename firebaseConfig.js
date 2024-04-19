// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

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
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signOut };
