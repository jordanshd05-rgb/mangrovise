import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChRWUyNhFlljxtauq4MgB6T-qb9lDkj-8",
  authDomain: "mangrovise-web.firebaseapp.com",
  databaseURL: "https://mangrovise-web-default-rtdb.firebaseio.com",
  projectId: "mangrovise-web",
  storageBucket: "mangrovise-web.firebasestorage.app",
  messagingSenderId: "290794881981",
  appId: "1:290794881981:web:b8765a19d94827d75748d4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
