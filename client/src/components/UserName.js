import '../styles/User.css';
import { useContext } from "react";
import UserContext from '../contexts/UserContext';

const UserName = ({ id, full_name }) => {
  const { setUserPageId } = useContext(UserContext);
  
  const handleClick = () => {
    if (!id) return;
    
    setUserPageId(id);
  }
  
  return (
    <button className="user-profile-name" onClick={handleClick}>
      <span className='user-profile-name-span'>{full_name}</span>
    </button>
  );
}

export default UserName;