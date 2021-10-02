import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import styled from 'styled-components';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <ChatContainerMobile>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainerMobile>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id);
  // console.log('chats screen:', ref)
  // Prep the messages on server
  const messagesRes = await ref.collection('messages').orderBy('timestamp', 'asc').get();
  // console.log('messages res:', messagesRes);

  const messages = messagesRes.docs.map(doc => ({
    // transform data into object
    id: doc.id,
    ...doc.data()
  })).map(messages => ({
    // then add timestamp to our newly made object
    // toDate func provided by firebase
    // getTime is UNIX timestamp
    ...messages,
    timestamp: messages.timestamp.toDate().getTime()
  }));

  // Prep chats
  const chatRes = await ref.get();
  // Grab id and spread rest of data
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  };

  console.log('SSR in action:', chat, messages);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat
    }
  };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 577px) {
    display: none;
  }
`;
const ChatContainerMobile = styled.div`
  display: none;
  @media (max-width: 577px) {
    background-color: #2e2e2e;
    z-index: 400;
    height: 100vh;
    width: 100vw;
    position: absolute;
    display: block;
  }
`;