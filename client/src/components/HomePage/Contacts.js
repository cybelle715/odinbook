import '../../styles/Contacts.css';
import { useState, useEffect, useContext } from "react";
import { getFriends } from '../../apis/userAPI';
import LoadingIcon from '../LoadingIcon';
import UserNameplate from '../UserNameplate';
import SocketContext from '../../contexts/SocketContext';
import UserContext from '../../contexts/UserContext';

const Contacts = (props) => {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  
  useEffect(() => {
    setLoading(true);
    
    getFriends()
      .then(res => {
        setFriends(res.data);
      })
      .finally(() => setLoading(false));
  }, [props.update]);
  
  useEffect(() => {
    const handleEvent = (data) => {
      if (data.friends.includes(user.id)) {
        getFriends()
          .then(res => {
            setFriends(res.data);
          });
      }
    }
    
    socket.on('update_friends', handleEvent);
    
    return () => socket.off('update_friends', handleEvent);
  }, [socket, user.id]);
  
  const listFriends = () => {
    if (friends.length === 0) return <p>No friends :(</p>
    
    return (
      friends.map((friend, index) => {
        return <UserNameplate key={index} nameplateUser={friend} pfp={friend.pfp} />;
      })
    );
  }
  
  return (
    <div id="contacts">
      {
        loading ? <LoadingIcon /> : listFriends()
      }
    </div>
  );
}

export default Contacts;