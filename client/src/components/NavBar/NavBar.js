import '../../styles/NavBar.css';
import { useContext } from "react";
import UserContext from '../../contexts/UserContext';
import NavSearch from './NavSearch';
import NavAccount from './NavAccount';
import { ThemeContext } from '../../contexts/ThemeContext';
import NavTheme from './NavTheme';

const NavBar = () => {
  const { user, setUserPageId } = useContext(UserContext);
  const { icons } = useContext(ThemeContext);
  
  const handleHome = () => {
    setUserPageId(null);
  }
  
  return (
    <div id="navbar">
      <div className='nav-left'>
        <img className='nav-home' src={icons.home} alt="Home Page" onClick={handleHome} />
        <NavSearch />
      </div>
      
      <NavTheme />
      <NavAccount user={user} />
    </div>
  );
}

export default NavBar;