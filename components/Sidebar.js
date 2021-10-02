import React from 'react';
import Link from 'next/link';
import { Avatar, Button, IconButton } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
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

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection('chats').add({
        users: [user.email, input],
      })
    }
  }

  function chatAlreadyExists(recipientEmail) {
    return !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0);
  }

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          title="My Account"
        />
        <IconsContainer>
          <SidebarIconButton>
            <Link href='/'><HomeIcon /></Link>
          </SidebarIconButton>
          <SidebarIconButton onClick={() => auth.signOut()}>
            <ExitToAppIcon />
          </SidebarIconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIconLight />
        <SearchInput placeholder="Search chats" />
      </Search>
      <SidebarButton onClick={createChat}>
        <ChatIcon />
        Start new chat</SidebarButton>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  background-color: #2e2e2e;
  flex: 0.45;
  border-right: 1px solid #444;
  height: 100vh;
  min-width: 210px;
  max-width: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 577px) {
    flex: 1;
    max-width: 100vw;
  }
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #2e2e2e;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid #444;
  @media (max-width: 577px) {
    height: 65px;
  }
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  };
`;
const IconsContainer = styled.div``;
const SidebarIconButton = styled(IconButton)`
  &&& {
    color: gainsboro;
    :hover {
    background-color: #333;
    }
  }

  @media (max-width: 577px) {
    > svg {
      font-size: 1.2rem;
    }
  }
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 3px;
`;
const SearchIconLight = styled(SearchIcon)`
  color: gainsboro;
`;
const SearchInput = styled.input`
  background-color: #2e2e2e;
  color: whitesmoke;
  outline: 0;
  border: none;
  padding: 0 10px;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;
  font-style: upper;
  height: 3.5rem;

  &&& {
    font-weight: bold;
    border-radius: 0;
    background-color: #367236;
    color: gainsboro;
    :hover {
      background-color: #2f642f;
    }
  }

  svg {
    margin-right: 10px;
  }
`;