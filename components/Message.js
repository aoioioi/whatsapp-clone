// use date-fns instead (!)
import moment from 'moment';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';


function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  // console.log('userLoggedIn', userLoggedIn)
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  )
}

export default Message;

const Container = styled.div``;
const MessageElement = styled.p`
  width: fit-content;
  padding: 7px 15px;
  padding-right: 10px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;
const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #cbe0bc;
`;
const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  padding-right: 20px;
  padding-left: 10px;
  text-align: left;
`
const Timestamp = styled.div`
  color: grey;
  padding: 7px;
  padding-bottom: 8px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;