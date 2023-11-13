import { ModalContext } from '../../contexts/ModalContext';
import '../../styles/Button.css';
import { useContext } from 'react';
import EditProfileForm from './EditProfileForm';

const BtnEditProfile = () => {
  const { handleModal } = useContext(ModalContext);
  
  const handleClick = () => {
    handleModal(<EditProfileForm />);
  }
  
  return (
    <button type='button' className='btn btn-wide' onClick={handleClick}>Edit Profile</button>
  );
}

export default BtnEditProfile;