import styled from 'styled-components';
import { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Avatar, IconButton } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachmentIcon from '@material-ui/icons/AttachFile';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import MicIcon from '@material-ui/icons/Mic';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const router = useRouter();

  const tabletWidth = useMediaQuery('(max-width: 577px)');

  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );
  const [recipientSnapshot] = useCollection(
    db
      .collection('users').where('email', '==', getRecipientEmail(chat.users, user))
  );

  function showMessages() {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
          }}
        />
      ));
    } else {
      // Enable SSR
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={message}
        />
      ))
    }
  }

  function scrollToBottom() {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  function sendMessage(e) {
    e.preventDefault();

    // Create last seen status and merge/concat into object
    db.collection('users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    db.collection('chats').doc(router.query.id).collection('messages').add(
      {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL
      }
    );

    setInput('');
    scrollToBottom();
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>
            {tabletWidth ? (recipientEmail.length <= 15
              ? recipientEmail
              : `${recipientEmail.slice(0, 15)}${'...'}`) : recipientEmail}
          </h3>
          {recipientSnapshot ? (
            <p>
              Last active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : 'Unavailable'}
            </p>
          ) : (
            <p>Loading last active status...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <HeaderIconButton>
            <Link href="/"><ArrowBackIcon /></Link>
          </HeaderIconButton>
          <HeaderIconButton>
            <AttachmentIcon />
          </HeaderIconButton>
          <HeaderIconButton>
            <MoreVertIcon />
          </HeaderIconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <InputIconButton>
          <MicIcon />
        </InputIconButton>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <InputIconButton onClick={sendMessage} type="submit">
          <SendRoundedIcon />
        </InputIconButton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  flex: 1;
  @media (max-width: 577px) {
    z-index: 400;
    position: absolute;
    width: 100vw;
  }
`;

const Header = styled.div`
  position: sticky;
  display: flex; 
  background-color: #2e2e2e;
  color: gainsboro;
  z-index: 100;
  top: 0;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid #444;
  @media (max-width: 577px) {
    height: 65px;
  }
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    font-weight: normal;
    margin-bottom: 3px;
  }

  > p {
    margin-top: 0;
    font-size: 14px;
    color: grey;
  }

  @media (max-width: 768px) {
    > h3 {
      font-size: 15px;
    }
  }
  @media (max-width: 577px) {
    > p {
      font-size: 12px;
    }
  }
`;
const HeaderIcons = styled.div``;
const HeaderIconButton = styled(IconButton)`
  &&& {
    color: gainsboro;

    :hover {
    background-color: #333;
    }

    @media (max-width: 768px) {
      height: 30px;
      width: 30px;

      svg {
        font-size: 1.2rem;
      }
    }
  }
`;
const MessageContainer = styled.div`
  padding: 20px;
  background-color: #3a3a3a;
  min-height: 90vh;
  @media (max-width: 577px) {
    padding: 15px 10px;
  }
`;
const EndOfMessage = styled.div`
  margin-bottom: 20px;
`;
const InputContainer = styled.form`
  background-color: #2e2e2e;
  display: flex;
  align-items: center;
  padding: 10px 18px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  @media (max-width: 577px) {
    padding: 10px 6px;
  }
`;
const Input = styled.input`
  background-color: #505050;
  color: gainsboro;
  flex: 1;
  padding: 12px;
  outline: 0;
  border: none;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
  @media (max-width: 577px) {
    padding: 12px;
    margin-left: 7px;
    margin-right: 7px;
  }
`;
const InputIconButton = styled(IconButton)`
  svg {
    height: 1.8rem;
    width: 1.8rem;
  }
  &&& {
    color: gainsboro;
    padding: 5px;
  }

  @media (max-width: 577px) {
    svg {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
`;