import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "whatsapp-cc982.firebaseapp.com",
  projectId: "whatsapp-cc982",
  storageBucket: "whatsapp-cc982.appspot.com",
  messagingSenderId: "624474503170",
  appId: "1:624474503170:web:54ccfb1151c5091c940f1b",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const database = firebase.database();
