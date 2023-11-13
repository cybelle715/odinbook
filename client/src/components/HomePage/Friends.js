import { getFriends } from '../../apis/userAPI';
import '../../styles/Friends.css';
import { useEffect, useState } from 'react';
import UserProfilePicture from '../UserProfilePicture';
import UserName from '../UserName';
import LoadingIcon from '../LoadingIcon';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  
  /**
   * This useEffect loads up all friends to be displayed
   */
  
  useEffect(() => {
    getFriends()
      .then(res => setFriends(res.data))
      .finally(() => setLoading(false));
  }, []);
  
  return (
    <div className='friends card'>
      {
        friends.map((friend, index) => {
          return (
            <div key={index} className='friend'>
              <UserProfilePicture id={friend.id} pfp={friend.pfp} large={true} />
              <UserName id={friend.id} full_name={friend.full_name} />
            </div>
          );
        })
      }
      
      { loading ? <LoadingIcon /> : null }
      
      { !loading && friends.length === 0 ? <span>No friends :(</span> : null }
    </div>
  );
}

export default Friends;