import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { logOut } from '../apis/userAPI';

const useAuthentication = () => {
  const { setUser, setUserPageId } = useContext(UserContext);
  
  const authLogin = (user) => {
    setUser({
      ...user,
      loggedIn: true
    });
  }
  
  const authLogout = () => {
    logOut()
      .then(() => {
        setUser({ loggedIn: false });
        setUserPageId(null);
      });
  }
  
  return { authLogin, authLogout };
}

export default useAuthentication;