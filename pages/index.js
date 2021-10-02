import React, { Fragment } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Welcome from '../components/Welcome';

import styled from 'styled-components';

import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#2e2e2e', display: 'flex' }}>
      <Head>
        <title>Chatsapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <Welcome />
    </div>
  );
}

// add user auth to pull up only their contacts from db
export async function getServerSideProps() {
  const ref = await db.collection('chats').get();

  // console.log('chats ref:', ref);
  // alternative method, do for loop as in full-app api.js
  const chats = ref.docs
    .map(doc => (doc.data()))
    .map(chats => ({
      loggedInUser: chats.users[0],
      userContact: chats.users[1]
    }));
  console.log('chats:', chats)
  console.log(chats[2].userContact)

  return {
    props: {}
  };
}

const SidebarIndex = styled(Sidebar)`
&&& {
  border-right: 0 !important; }
`;