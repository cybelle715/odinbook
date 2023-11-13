import { useEffect, useState } from 'react';

const root = document.querySelector(':root');

const useTheme = (theme) => {
  const [icons, setIcons] = useState({});
  const [currentTheme, setCurrentTheme] = useState({});
  
  useEffect(() => {
    if (theme) setTheme(theme);
  }, [theme]);
  
  const setTheme = (theme) => {
    for (const prop in theme.colors) {
      if (Object.prototype.hasOwnProperty.call(theme.colors, prop)) {
        root.style.setProperty(prop, theme.colors[prop]);
      }
    }
    
    setIcons(theme.icons);
    setCurrentTheme(theme);
  }
  
  return { setTheme, icons, currentTheme };
}

export default useTheme;