import '../styles/globals.css';
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import firebase from 'firebase';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  // store user data first load
  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loading />;

  // Access chats page if user authenticated else generate Login page
  if (!user) return <Login />;
  return <Component {...pageProps} />
}

export default MyApp
