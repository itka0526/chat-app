const config = {
    apiKey: "AIzaSyAw48_qtLFMvcsR5t9oiLDWRJZn7Y-1ZOc",
    authDomain: "chat-9326e.firebaseapp.com",
    projectId: "chat-9326e",
    storageBucket: "chat-9326e.appspot.com",
    messagingSenderId: "38210506845",
    appId: "1:38210506845:web:54e64f7c648e817b5fbdb4",
    measurementId: "G-7GTX46KRWR",
};

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = initializeApp(config);
export const firebaseAppAuth = getAuth(firebaseApp);
export const firebaseAppFirestore = getFirestore(firebaseApp);
