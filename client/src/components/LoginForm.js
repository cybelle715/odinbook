import '../styles/Form.css';
import '../styles/Button.css';
import { useState, useContext } from "react";
import { login } from "../apis/userAPI";
import SignupForm from './SignupForm';
import { ModalContext } from '../contexts/ModalContext';
import useAuthentication from '../hooks/useAuthentication';
import ErrorModal from './ErrorModal';

const LoginForm = ({ reload }) => {
  const { handleModal } = useContext(ModalContext);
  const { authLogin } = useAuthentication();
  
  const [data, setData] = useState({
    username: '',
    password: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    login(data)
      .then(res => {
        authLogin(res.data);
        reload();
      })
      .catch(err => handleModal(<ErrorModal errors={err.response.data.errors } />));
    
    return true;
  }
  
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }
  
  const handleDemoAccount = (acc) => {
    const demoUser = {};
    
    switch (acc) {
      case 1:
        demoUser.username = 'Pattie0';
        demoUser.password = 'Di8MQuQeNsWqEgc';
        break;
      case 2:
        demoUser.username = 'Garrett3';
        demoUser.password = 'Fx2GbCSdnChToJf';
        break;
      default:
        break;
    }
    
    login(demoUser)
      .then(res => {
        authLogin(res.data);
        reload();
      })
      .catch(err => handleModal(<ErrorModal errors={err.response.data.errors } />));
  }
  
  return (
    <form className="form form-border form-shadows" onSubmit={handleSubmit}>
      <h2 className='login-page-title'>Log In</h2>
      
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button className="btn" type="submit">Log in</button>
      <button className="btn" type="button" onClick={() => handleModal(<SignupForm />)}>Sign up</button>
      
      <hr style={{
        width: '80%',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        border: 'none',
        height: '1px'
      }} />
      
      <button className='btn btn-short' type='button' onClick={() => handleDemoAccount(1)}>Try Demo Account 1</button>
      <button className='btn btn-short' type='button' onClick={() => handleDemoAccount(2)}>Try Demo Account 2</button>
    </form>
  );
}

export default LoginForm;