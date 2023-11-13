import { useState, useEffect, useContext } from "react";
import { getFriendsUser } from '../../apis/userAPI';
import '../../styles/Card.css';
import UserProfilePicture from "../UserProfilePicture";
import UserName from "../UserName";
import LoadingIcon from "../LoadingIcon";
import UserContext from "../../contexts/UserContext";

const UserFriends = (props) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userPageId } = useContext(UserContext);
  
  useEffect(() => {
    if (!userPageId) return;
    
    getFriendsUser(userPageId)
      .then(res => {
        setFriends(res.data ? res.data : []);
        
        const friendsCount = res.data ? res.data.length : 0;
        props.setFriendsCount(`${friendsCount} friend${friendsCount !== 1 ? 's' : ''}`);
      })
      .finally(() => setLoading(false));
  }, [props, userPageId]);
  
  return (
    <div className="user-friends card">
      <h3>Friends</h3>
      
      <div className="user-friends-cnt">
        {loading ? <LoadingIcon /> :
          (!friends || friends.length === 0) ? null :
            friends.map((friend, index) => {
              return (
                <div key={index} className="user-friends-user">
                  <UserProfilePicture pfp={friend.pfp} id={friend.id} large={true} />
                  <UserName full_name={`${friend.first_name} ${friend.last_name}`} id={friend.id} />
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

export default UserFriends;