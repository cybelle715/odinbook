import '../styles/Form.css';
import '../styles/Button.css';
import '../styles/Signup.css';
import '../styles/ErrorModal.css';
import { useContext, useEffect, useState } from 'react';
import { signup } from '../apis/userAPI';
import useAuthentication from '../hooks/useAuthentication';
import { ModalContext } from '../contexts/ModalContext';

const SignupForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const { authLogin } = useAuthentication();
  const { handleModal } = useContext(ModalContext);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    signup(formData)
      .then(res => {
        authLogin(res.data);
        handleModal();
      })
      .catch(err => setErrors(err.response.data.errors))
      .finally(() => setSubmitting(false));
  }
  
  useEffect(() => {
    if (formData.password !== formData.passwordVerify) {
      setErrors(['Passwords must match.']);
      setBtnDisabled(true);
    }
    else {
      setErrors([]);
      setBtnDisabled(false);
    }
  }, [formData.password, formData.passwordVerify]);
  
  return (
    <form className='form form-wide form-no-padding' onSubmit={handleSubmit}>
      <h2 className='signup-title'>Sign Up</h2>
      
      <div className='form-cnt'>
        <label htmlFor='username'>Username:</label>
        <input type='text' placeholder='Username' name='username' onChange={handleChange} />
      </div>
      
      <div className='form-cnt'>
        <label htmlFor='password'>Password:</label>
        <input type='password' placeholder='Password' name='password' onChange={handleChange} />
      </div>
      
      <div className='form-cnt'>
        <label htmlFor='passwordVerify'>Verify Password:</label>
        <input type='password' placeholder='Verify password' name='passwordVerify' onChange={handleChange} />
      </div>
      
      <div className='form-cnt'>
        <label htmlFor='first_name'>First Name:</label>
        <input type='text' placeholder='First Name' name='first_name' onChange={handleChange} />
      </div>
      
      <div className='form-cnt'>
        <label htmlFor='last_name'>Last Name:</label>
        <input type='text' placeholder='Last Name' name='last_name' onChange={handleChange} />
      </div>
      
      <div className='form-cnt'>
        <label htmlFor='age'>Age:</label>
        <input type='number' placeholder='Age' name='age' onChange={handleChange} />
      </div>
      
      <button type='submit' className='btn' style={{ marginTop: '20px' }} disabled={submitting || btnDisabled ? true : false}>Create</button>
      
      {
        errors && errors.length > 0 ? 
          <ul className='errors'>
          {
            errors.map((err, index) => <li key={index}>{err}</li>)
          }
        </ul>
        : null
      }
    </form>
  );
}

export default SignupForm;