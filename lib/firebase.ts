import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOwDPsSGnTsAFlvLelH5sc0hl5LcoFfgQ",
  authDomain: "hitokan-app.firebaseapp.com",
  projectId: "hitokan-app",
  storageBucket: "hitokan-app.appspot.com",
  messagingSenderId: "637945751202",
  appId: "1:637945751202:web:cd0abe7b8b9c48f25d99fb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);