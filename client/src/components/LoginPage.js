import LoginForm from './LoginForm';
import OBPresentation from './OBPresentation';
import '../styles/LoginPage.css';
import NavTheme from './NavBar/NavTheme';

const LoginPage = ({ reload }) => {
  return (
    <div className='login-page'>
      <div className="login-page-cnt">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <OBPresentation />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}><NavTheme /></div>
        </div>
        
        <div className='vl'></div>
        
        <div><LoginForm reload={reload} /></div>
      </div>
    </div>
  );
}

export default LoginPage;