// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSK4eV_NP2CTSBsNC-wfrro9mg2Ky3vak",
  authDomain: "taskfour-28e5d.firebaseapp.com",
  databaseURL: "https://taskfour-default-rtdb.firebaseio.com",
  projectId: "taskfour",
  storageBucket: "taskfour.firebasestorage.app",
  messagingSenderId: "577738060444",
  appId: "1:577738060444:web:5854b26200f76031c17359"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
export { database };