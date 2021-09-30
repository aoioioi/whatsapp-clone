import styled from 'styled-components';
import { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachmentIcon from '@material-ui/icons/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const router = useRouter();

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
          <h3>{recipientEmail}</h3>
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
          <IconButton>
            <AttachmentIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  flex: 1;
`;

const Header = styled.div`
  position: sticky;
  display: flex; 
  background-color: white;
  z-index: 100;
  top: 0;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }

  > p {
    margin-top: 0;
    font-size: 14px;
    color: grey;
  }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessage = styled.div`
  margin-bottom: 20px;
`;
const InputContainer = styled.form`
  background-color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  z-index: 100;
`;
const Input = styled.input`
  background-color: whitesmoke;
  flex: 1;
  padding: 20px;
  outline: 0;
  border: none;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
`;