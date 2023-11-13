import '../../styles/Button.css';
import { removeFriend } from '../../apis/userAPI';
import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';

const BtnUnfriend = ({ id }) => {
  const { setUserPageId } = useContext(UserContext);
  
  const handleClick = () => {
    removeFriend(id)
      .then(() => setUserPageId(null));
  }
  
  return (
    <button type='button' className='btn' onClick={handleClick}>Unfriend</button>
  );
}

export default BtnUnfriend;