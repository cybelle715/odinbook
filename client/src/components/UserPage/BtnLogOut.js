import '../../styles/Button.css';
import useAuthentication from '../../hooks/useAuthentication';

const ButtonLogOut = () => {
  const { logout } = useAuthentication();
  
  return (
    <button type='button' className='btn btn-wide' onClick={logout}>Log Out</button>
  );
}

export default ButtonLogOut;