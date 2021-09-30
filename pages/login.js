import React from 'react';
import Head from 'next/head';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { auth, provider } from '../firebase';

function Login() {
  function signIn() {
    auth.signInWithPopup(provider).catch(alert);
  }

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fdtafalonso%2Fandroid-l%2F512%2FWhatsApp-icon.png&f=1&nofb=1" />
        <Button onClick={signIn} variant="outlined">Sign in with Google</Button>

      </LoginContainer>

    </Container>
  )
}

export default Login

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  display: flex;
  padding: 100px;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.2);
`;
const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;