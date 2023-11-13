import '../../styles/ChatBox.css';
import '../../styles/Form.css';
import '../../styles/Button.css';
import '../../styles/SVG.css';
import { useContext, useEffect } from "react";
import ChatLog from './ChatLog';
import ChatInput from './ChatInput';
import SocketContext from '../../contexts/SocketContext';
import ChatContext from '../../contexts/ChatContext';
import { ThemeContext } from '../../contexts/ThemeContext';

const ChatBox = () => {
  const { chatBoxId, setChatBoxId } = useContext(ChatContext);
  const { socket } = useContext(SocketContext);
  const { icons } = useContext(ThemeContext);
  
  useEffect(() => {
    if (!chatBoxId) return;
    
    socket.emit('join_chat', { chat: chatBoxId });
    
    return () => socket.emit('leave_chat', { chat: chatBoxId });
  }, [chatBoxId, socket]);
  
  const handleClose = () => {
    setChatBoxId(null);
  }
  
  return (
    <div className="chatbox card">
      <input type='image' className='svg' src={icons.close} alt='Close Chat' onClick={handleClose} style={{
        width: '30px',
        height: 'auto',
        marginLeft: 'auto'
      }} />
        <>
          <ChatLog />
          <ChatInput />
        </>
    </div>
  );
}

export default ChatBox;