import { useContext } from 'react';
import '../styles/Footer.css';
import { ThemeContext } from '../contexts/ThemeContext';

const Footer = () => {
  const { icons } = useContext(ThemeContext);
  
  return (
    <div id='footer'>
      <span>Created by Wantonfury</span>
      <a href='https://github.com/Wantonfury/odinbook' target='_blank' rel='noreferrer noopener'>
        <img src={icons.github} alt='Link to GitHub' />
      </a>
    </div>
  );
}

export default Footer;