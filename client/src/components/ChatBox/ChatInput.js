import { useState, useContext } from "react";
import { addMessage } from '../../apis/chatAPI';
import SocketContext from "../../contexts/SocketContext";
import ChatContext from "../../contexts/ChatContext";
import { ModalContext } from "../../contexts/ModalContext";
import ErrorModal from "../ErrorModal";

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { socket } = useContext(SocketContext);
  const { chatBoxId } = useContext(ChatContext);
  const { handleModal } = useContext(ModalContext);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    addMessage(chatBoxId, message)
      .then(res => {
        socket.emit('send_message', { chat: chatBoxId, message: res.data });
      })
      .catch(err => {
        handleModal(<ErrorModal errors={err.response.data.errors} />);
      })
      .finally(() => {
        setMessage('');
      });
  }
  
  const handleChange = (e) => {
    setMessage(e.target.value);
  }
  
  return (
    <form className="chatbox-input" onSubmit={handleSubmit}>
      <textarea value={message} onChange={handleChange} />
      <button disabled={message.length === 0 ? true : false} type="submit" className="btn">Send</button>
    </form>
  );
}

export default ChatInput;