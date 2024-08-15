// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAchYZ9XPsQ9t8sQKN07mdx9ytT1Hf-xY0",
  authDomain: "flashcard-saas-36f89.firebaseapp.com",
  projectId: "flashcard-saas-36f89",
  storageBucket: "flashcard-saas-36f89.appspot.com",
  messagingSenderId: "1083251991655",
  appId: "1:1083251991655:web:02892248e18662805ae0c2",
  measurementId: "G-3ZBT79XMVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export default db;