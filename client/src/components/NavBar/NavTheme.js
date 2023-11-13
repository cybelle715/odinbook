import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import '../../styles/NavBar.css';
import '../../styles/Button.css';

const NavTheme = () => {
  const { icons, lightTheme, darkTheme, setTheme, currentTheme } = useContext(ThemeContext);
  const [selectedTheme, setSelectedTheme] = useState(lightTheme);
  
  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);
  
  const handleClick = (theme) => {
    setSelectedTheme(theme);
    setTheme(theme);
  }
  
  return (
    <div className='nav-theme'>
      <button className='btn nav-theme-btn btn-no-cursor'> 
        <img src={icons.theme} alt='Theme Selector' />
        Theme
      </button>
      
      <div className='nav-theme-options'>
        <button className='btn btn-wide' disabled={selectedTheme === lightTheme ? true : false} onClick={() => handleClick(lightTheme)}>Light</button>
        <button className='btn btn-wide' disabled={selectedTheme === darkTheme ? true : false} onClick={() => handleClick(darkTheme)}>Dark</button>
      </div>
    </div>
  );
}

export default NavTheme;