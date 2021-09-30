import React from 'react';
import { Avatar, Button, IconButton } from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Chat from '../components/Chat';

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  function createChat() {
    const input = prompt('Enter the email address of the user you want to chat with:');

    // Exit if falsy
    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // Add chat to db in firestore with logged in user and recipient email
      db.collection('chats').add({
        users: [user.email, input],
      })
    }
  }

  function chatAlreadyExists(recipientEmail) {
    // ?optional chaining. return element or falsy, use for asyncs
    // !! if truthy then true, if falsy then false
    return !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0);
  }

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search chats" />
      </Search>
      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}

    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  };
`;
const IconsContainer = styled.div``;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 3px;`;
const SearchInput = styled.input`
  outline: 0;
  border: none;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;
  font-style: upper;
  // Increase rule priority over Material
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }

`;