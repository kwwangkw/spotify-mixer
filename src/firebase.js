import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
    apiKey: "AIzaSyBbNNFr0islloydHYfQMXphnUR1J0WutVQ",
    authDomain: "spotify-mixer-7dff8.firebaseapp.com",
    projectId: "spotify-mixer-7dff8",
    storageBucket: "spotify-mixer-7dff8.appspot.com",
    messagingSenderId: "63170570354",
    appId: "1:63170570354:web:e3466c0352067402bebaeb",
    measurementId: "G-Y1RM9N243J"
  };

  export default !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
  
  firebase.analytics();