import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


//first try
const firebaseConfig = {
  apiKey: "AIzaSyAitdrzRKounf9rnW1zqVXAPN05won1vIo",
  authDomain: "chat-with-pdf-ed866.firebaseapp.com",
  projectId: "chat-with-pdf-ed866",
  storageBucket: "chat-with-pdf-ed866.firebasestorage.app",
  messagingSenderId: "1011948412921",
  appId: "1:1011948412921:web:af37f53f2778d6b985e728",
  measurementId: "G-EP477DVYVW",
};



const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
