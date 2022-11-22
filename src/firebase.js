// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuyTCwnkURvaLn_SbGyBy9pd1RYk5MLsQ",
    authDomain: "todo-app-821c2.firebaseapp.com",
    projectId: "todo-app-821c2",
    storageBucket: "todo-app-821c2.appspot.com",
    messagingSenderId: "881392338780",
    appId: "1:881392338780:web:fc45d8d03b14bf79d66399"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);



