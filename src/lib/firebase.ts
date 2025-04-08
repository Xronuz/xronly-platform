import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyBZhJP-Mkl0bs1Onh-f2JExDeM7Wm5FoD8",
    authDomain: "xronlypro.firebaseapp.com",
    projectId: "xronlypro",
    storageBucket: "xronlypro.firebasestorage.app",
    messagingSenderId: "795592506487",
    appId: "1:795592506487:web:9b483c92debbf6a6155a72",
    measurementId: "G-2702EQ0MQS"
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
