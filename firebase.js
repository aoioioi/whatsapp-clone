import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBCJKA9agpPawKFa7o2tIWO5PqKO9e1C30",
  authDomain: "whatsappchats-8639b.firebaseapp.com",
  projectId: "whatsappchats-8639b",
  storageBucket: "whatsappchats-8639b.appspot.com",
  messagingSenderId: "1029813178538",
  appId: "1:1029813178538:web:652c67da225c48939e00d3"
};

// Initialise firebase app if not initialised
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };