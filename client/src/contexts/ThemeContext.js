import { createContext } from 'react';
import useTheme from '../hooks/useTheme';

import IconAccountLight from '../assets/images/account-default-image.svg';
import IconHomeLight from '../assets/images/home.svg';
import IconThumbUpLight from '../assets/images/thumb-up.svg';
import IconGithubLight from '../assets/images/github-mark.png';
import IconThemeLight from '../assets/images/theme-light.svg';
import IconSendLight from '../assets/images/arrow-right.svg';
import IconCloseLight from '../assets/images/close-circle.svg';

import IconAccountDark from '../assets/images/account-default-image-dark.svg';
import IconHomeDark from '../assets/images/home-dark.svg';
import IconThumbUpDark from '../assets/images/thumb-up-dark.svg';
import IconGithubDark from '../assets/images/github-mark-white.png';
import IconThemeDark from '../assets/images/theme-dark.svg';
import IconSendDark from '../assets/images/arrow-right-dark.svg';
import IconCloseDark from '../assets/images/close-circle-dark.svg';

const ThemeContext = createContext();

const lightTheme = {
  colors: {
    '--btn-clr': '#3da9fc',
    '--btn-clr-hover': '#038df6',
    '--btn-clr-active': '#037bd7',
    '--btn-contacts-hover': '#7cc6fb',
    '--btn-contacts-active': '#4eb2fa',
    '--background': '#d8eefe',
    '--card': 'white',
    '--text-clr': 'black',
    '--text-clr-reversed': 'white'
  },
  icons: {
    account: IconAccountLight,
    home: IconHomeLight,
    like: IconThumbUpLight,
    github: IconGithubLight,
    theme: IconThemeLight,
    send: IconSendLight,
    close: IconCloseLight
  }
}

const darkTheme = {
  colors: {
    '--btn-clr': '#7f5af0',
    '--btn-clr-hover': '#501dea',
    '--btn-clr-active': '#4213d3',
    '--btn-contacts-hover': '#a58bf4',
    '--btn-contacts-active': '#7c56ef',
    '--background': '#16161a',
    '--card': '#242629',
    '--text-clr': 'white',
    '--text-clr-reversed': 'black'
  },
  icons: {
    account: IconAccountDark,
    home: IconHomeDark,
    like: IconThumbUpDark,
    github: IconGithubDark,
    theme: IconThemeDark,
    send: IconSendDark,
    close: IconCloseDark
  }
}

const ThemeProvider = ({ children }) => {
  const { setTheme, icons, currentTheme } = useTheme(lightTheme);
  
  return (
    <ThemeContext.Provider value={{ lightTheme, darkTheme, setTheme, icons, currentTheme }}>
      { children }
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };