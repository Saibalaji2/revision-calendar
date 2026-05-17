import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyD4hZhKBlGf4nK7lpa94-Ib6sj1-q4h--4",

  authDomain: "calendar-app-e2b8a.firebaseapp.com",

  projectId: "calendar-app-e2b8a",

  storageBucket: "calendar-app-e2b8a.appspot.com",

  messagingSenderId: "1083193235317",

  appId: "1:1083193235317:web:4f847243eccd54f662253c",

  measurementId: "G-4H8FWYM0NX"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);