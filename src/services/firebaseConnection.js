import firebase from "firebase";
import 'firebase/auth';
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDXQAKE38F0bP-Zsz92F3u4SJIniq9f8dw",
  authDomain: "apptasks-2c987.firebaseapp.com",
  projectId: "apptasks-2c987",
  storageBucket: "apptasks-2c987.appspot.com",
  messagingSenderId: "233254432621",
  appId: "1:233254432621:web:8a6a62f273d72537087464",
  measurementId: "G-FB9G0FRF5S"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;