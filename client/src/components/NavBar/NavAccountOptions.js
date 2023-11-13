import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import useAuthentication from "../../hooks/useAuthentication";

const NavAccountOptions = () => {
  const { user, setUserPageId } = useContext(UserContext);
  const { authLogout } = useAuthentication();
  
  const handleAccount = () => {
    setUserPageId(user.id);
  }
  
  const handleLogOut = () => {
    authLogout();
  }
  
  return (
    <div className='nav-account-options'>
      <button type='button' className='btn btn-wide' onClick={handleAccount}>Account</button>
      <button type='button' className='btn btn-wide' onClick={handleLogOut}>Log Out</button>
    </div>
  );
}

export default NavAccountOptions;