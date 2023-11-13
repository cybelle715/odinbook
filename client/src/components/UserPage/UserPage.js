import '../../styles/UserPage.css';
import UserPosts from './UserPosts';
import { useState } from 'react';
import UserFriends from './UserFriends';
import UserInfo from './UserInfo';

const UserPage = () => {
  const [friendsCount, setFriendsCount] = useState('');
  
  return (
    <div className="user-page">
      <div className='user-page-cnt'>
        <UserInfo friendsCount={friendsCount} />
        
        <div className="user-page-details">
          <UserFriends setFriendsCount={setFriendsCount} />
          <UserPosts />
        </div>
      </div>
    </div>
  );
}

export default UserPage;