import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipentSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientEmail(users, user))
  );

  function enterChat() {
    router.push(`/chat/${id}`)
  }

  // Get all data from user with matched email if it exists
  // data() returns all data
  const recipient = recipentSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  color: gainsboro;
  /* height: 60px; */
  cursor: pointer;
  padding: 10px 15px;
  // split word over multiple lines (?)
  word-break: break-word;

  :hover {
    background-color: #333;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;