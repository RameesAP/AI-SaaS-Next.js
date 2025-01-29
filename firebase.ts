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


// eth second try ann
// const firebaseConfig = {
//   apiKey: "AIzaSyCNKhvek5DKeExIOtGzPJ2EOmUmy0K9YoY",
//   authDomain: "chat-with-pdf2.firebaseapp.com",
//   projectId: "chat-with-pdf2",
//   storageBucket: "chat-with-pdf2.firebasestorage.app",
//   messagingSenderId: "333600166785",
//   appId: "1:333600166785:web:3c9ed09f60891da3720e80"
// };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
