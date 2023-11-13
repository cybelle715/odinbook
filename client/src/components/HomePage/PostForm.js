import { useState, useEffect } from "react";
import '../../styles/Form.css';
import '../../styles/Button.css';
import { post } from "../../apis/postsAPI";
import '../../styles/ErrorModal.css';

const PostForm = (props) => {
  const [errors, setErrors] = useState();
  const [formData, setFormData] = useState({
    message: props.message
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    post(formData)
      .then(() => {
        props.setMessage('');
        props.reload(true);
        document.querySelector('#modal-close').click();
      })
      .catch(err => setErrors(err.response.data.errors));
  }
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }
  
  const handleFile = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    })
  }
  
  useEffect(() => {
    props.setMessage(formData.message);
  }, [props, formData]);
  
  return (
    <>
      <form className="form form-wide" onSubmit={handleSubmit}>
        <textarea rows="20" name="message" value={formData.message} onChange={handleChange} />
        
        <div className='form-cnt'>
          <label htmlFor='photo'>Add photo: </label>
          <input type='file' name='photo' accept='.png, .jpg, .jpeg, .svg, .webp' onChange={handleFile} />
        </div>
        <button className="btn btn-wide" type="submit" disabled={formData.message?.length === 0 ? true : false}>Post</button>
      </form>
      
      {
        errors ? 
        <ul className='errors'>
          { errors.map((err, index) => <li key={index}>{err}</li>) }
        </ul> : null
      }
    </>
  );
}

export default PostForm;