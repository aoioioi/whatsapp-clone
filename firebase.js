import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.firebase_api_key,
  authDomain: "whatsappchats-8639b.firebaseapp.com",
  projectId: "whatsappchats-8639b",
  storageBucket: "whatsappchats-8639b.appspot.com",
  messagingSenderId: "1029813178538",
  appId: "1:1029813178538:web:652c67da225c48939e00d3"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };