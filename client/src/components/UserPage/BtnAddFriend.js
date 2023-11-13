import '../../styles/Button.css';
import { addFriend } from '../../apis/userAPI';

const BtnAddFriend = ({ id, update }) => {
  const handleClick = () => {
    addFriend(id)
      .then(() => {
        if (update) update();
      });
  }
  
  return (
    <button type='button' className='btn btn-wide' onClick={handleClick}>Add Friend</button>
  );
}

export default BtnAddFriend;