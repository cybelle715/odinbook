import { useState, useEffect, useContext } from "react";
import { getUser, checkFriend } from '../../apis/userAPI';
import LoadingIcon from "../LoadingIcon";
import UserProfilePicture from "../UserProfilePicture";
import UserName from "../UserName";
import BtnUnfriend from "./BtnUnfriend";
import BtnMessage from "./BtnMessage";
import UserContext from "../../contexts/UserContext";
import BtnEditProfile from "./BtnEditProfile";
import ButtonLogOut from "./BtnLogOut";
import BtnAddFriend from "./BtnAddFriend";

const UserInfo = (props) => {
  const [userData, setUserData] = useState({});
  const [friendData, setFriendData] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, userPageId } = useContext(UserContext);
  
  useEffect(() => {
    if (!userPageId) return;
    
    if (userPageId === user.id) {
      setUserData(user);
      setLoading(false);
      return;
    }
    
    Promise.all([
      getUser(userPageId)
        .then(res => {
          setUserData(res.data ? { ...res.data } : {});
        }),
      checkFriend(userPageId)
        .then(res => setFriendData(res.data))
    ])
      .finally(() => setLoading(false));
  }, [loading, userPageId, user]);
  
  return (
    <div className="card user-page-info">
      {
        loading ? <LoadingIcon /> :
          <div className="user-page-info-user">
            <UserProfilePicture pfp={userData.pfp} large={true} />
            
            <div className="user-page-info-user-cnt">
              <UserName full_name={`${userData.first_name} ${userData.last_name}`} />
              <span>{props.friendsCount}</span>
            </div>
          </div>
      }
      
      
      <div className='user-page-info-options'>
        {
          user.id === userData.id ?
          <>
            <BtnEditProfile />
            <ButtonLogOut id={user.id} />
          </> :
            <>
              { friendData.friend && !friendData.pending ? 
                <>
                  <BtnUnfriend id={userPageId} />
                  <BtnMessage id={userPageId} />
                </>
                :
                <>
                  { friendData.friend && friendData.pending ? <button type='button' className='btn btn-wide'>Pending</button> : <BtnAddFriend id={userPageId} update={() => setFriendData({ friend: true, pending: true })} /> }
                </>
              }
              
            </>
        }
      </div>
      
    </div>
  );
}

export default UserInfo;