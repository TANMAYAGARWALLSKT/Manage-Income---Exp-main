import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGz6BNxww13WGhONWGhpYgrlIebpwQ2io",
  authDomain: "daring-fiber-420318.firebaseapp.com",
  projectId: "daring-fiber-420318",
  storageBucket: "daring-fiber-420318.appspot.com",
  messagingSenderId: "829531527735",
  appId: "1:829531527735:web:5cf1c8b90876f9f0ab7db2",
  measurementId: "G-ZCFCPNXJ9Q",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
