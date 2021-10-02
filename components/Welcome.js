import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase';
import { Avatar, IconButton } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery'


const doodles = [
  'https://doodleipsum.com/700/outline?i=a93d54c4c0a8118cdcec5640d21506c4',
  'https://doodleipsum.com/700/outline?i=a28bcf0176524d4f74e60f83ece7b5d7',
  'https://doodleipsum.com/700/outline?i=5208e2e7cc76908ca87743a34a863610',
  'https://doodleipsum.com/700/outline?i=2c350be916b8b173cd3026cbcdea1acb',
  'https://doodleipsum.com/700/outline?i=5ab2f67c138d27ecd527e23a908cab67',
  'https://doodleipsum.com/700/outline?i=cd18d4c55bb209bbe7a268bbf1ff6cb3',
  'https://doodleipsum.com/700/outline?i=e7ac99afaa93f0a4420addd61c51c268',
  'https://doodleipsum.com/700/outline?i=f3cbe7193809ac27eeb5dd92fcf5475a',
  'https://doodleipsum.com/700/outline?i=fcb5bd61f88331a7ada8b0de52dbc714',
  'https://doodleipsum.com/700/outline?i=fc98a065bf800cc86a699f6d7f2138f6'
];

function shuffle(arr) {
  let randomIdx = Math.floor(Math.random() * arr.length);
  return arr[randomIdx];
}

function Welcome() {
  const [user] = useAuthState(auth);
  console.log(user);

  const mobileLandscape = useMediaQuery('(max-height: 500px)');

  return (
    <Container>
      <HeaderContainer>
      </HeaderContainer>
      <GreetContainer>
        {!mobileLandscape && <img src={shuffle(doodles)} alt="" />}
        <h2>Welcome, {user.email}!</h2>
        <p>Start a new chat or click on a user to continue where you left off.</p>
      </GreetContainer>
    </Container>
  );
}

export default Welcome;

const Container = styled.div`
/* border-left: 1px solid #444; */
  flex: 1;
  @media (max-width: 577px) {
    display: none;
  }
`;
const HeaderContainer = styled.div`
  color: gainsboro;
  height: 80px;
  border-bottom: 1px solid #444;
`;
const GreetContainer = styled.div`
  color: gainsboro;
  padding: 30px;

  > img {
    max-width: 100%;
    max-height: 450px;
    height: auto;
  }

  > p {
    background-color: #3a3a3a;
    border-radius: 8px;
    padding: 20px;
  }
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  };
`;