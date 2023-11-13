import { useContext } from 'react';
import '../../styles/Button.css';
import ChatContext from '../../contexts/ChatContext';
import { getChatId } from '../../apis/chatAPI';

const BtnMessage = ({ id }) => {
  const { setChatBoxId } = useContext(ChatContext);
  
  const handleClick = () => {
    getChatId([ id ]).then(res => setChatBoxId(res.data));
  }
  
  return (
    <button type='button' className='btn' onClick={handleClick}>Message</button>
  );
}

export default BtnMessage;