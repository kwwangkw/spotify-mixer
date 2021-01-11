import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
    apiKey: process.env.GATSBY_API_KEY,
    authDomain: process.env.GATSBY_AUTH_DOMAIN,
    projectId: process.env.GATSBY_PROJECT_ID,
    storageBucket: process.env.GATSBY_STORAGE_BUCKET,
    messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
    appId: process.env.GATSBY_APP_ID,
    measurementId: process.env.GATSBY_MEASUREMENT_ID,
  };

  export default !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

  export const FieldValue = firebase.firestore.FieldValue;
  export const FieldPath = firebase.firestore.FieldPath;
  
  firebase.analytics();