// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Import all firebase keys from config
import config from "./config/config";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(config.firebaseConfig);
// !Export this db to use in app
export const db = getFirestore(app);

// !Export authentication to use in app
export const auth = getAuth(app);


//const analytics = getAnalytics(app);