// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
//import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz35jZBENPhqbnNMuLna8MB3L0f0QyaCM",
  authDomain: "pantry-tracker-26e97.firebaseapp.com",
  projectId: "pantry-tracker-26e97",
  storageBucket: "pantry-tracker-26e97.appspot.com",
  messagingSenderId: "182162451662",
  appId: "1:182162451662:web:fe175630f68332d5cf349f",
  measurementId: "G-J676SEQC3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
export { firestore };