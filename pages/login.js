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
        <Logo src="https://icons.iconarchive.com/icons/dtafalonso/android-l/512/WhatsApp-icon.png" />
        <LoginButton onClick={signIn}>Sign in with Google</LoginButton>
      </LoginContainer>
    </Container>
  );
}

export default Login

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: #2e2e2e;
  @media (max-height: 400px) {
    height: 100%;
  }
`;
const LoginContainer = styled.div`
  display: flex;
  padding: 100px;
  flex-direction: column;
  align-items: center;
  background-color: #3a3a3a;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.2);
  @media (max-width: 577px) {
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #2e2e2e;
  }
`;
const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
const LoginButton = styled(Button)`
  &&& {
    padding: .7rem 1.2rem;
    font-weight: bold;
    color: gainsboro;
    border: 1px solid gainsboro;
    :hover {
      opacity: .7;
    }
  }
`;