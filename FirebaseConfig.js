import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import Firebase Authentication
import { getFirestore } from "firebase/firestore";

const FirebaseConfig = {
    apiKey: "AIzaSyCJaW5ZSMuN7Jvi1Jd6BEOECogkmJ3SPOQ",
    authDomain: "react-app-e3b85.firebaseapp.com",
    projectId: "react-app-e3b85",
    storageBucket: "react-app-e3b85.firebasestorage.app",
    messagingSenderId: "807638439935",
    appId: "1:807638439935:web:8775c09cbce1e7957eb9ca",
    measurementId: "G-NGKFYJGPNC"
  };

  const app = initializeApp(FirebaseConfig);
  const auth = getAuth(app); // Initialize Authentication
  const db = getFirestore(app); // Initialize Firestore
  
  export { app, auth, db };