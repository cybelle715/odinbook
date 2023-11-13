import '../styles/Contacts.css';
import { useContext, useEffect, useState } from "react";
import ChatContext from '../contexts/ChatContext';
import { getUnreadMessagesCount, getChatId } from '../apis/chatAPI';
import SocketContext from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';
import { ThemeContext } from '../contexts/ThemeContext';

const UserNameplate = ({ nameplateUser }) => {
  const { user } = useContext(UserContext);
  const { chatBoxId, setChatBoxId } = useContext(ChatContext);
  const { socket } = useContext(SocketContext);
  const { icons } = useContext(ThemeContext);
  const [chatId, setChatId] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState();
  
  useEffect(() => {
    getChatId([ nameplateUser.id ])
      .then(res => {
        setChatId(res.data);
        
        getUnreadMessagesCount(res.data)
          .then(res => setUnreadMessages(res.data));
      });
  }, [nameplateUser.id, socket]);
  
  useEffect(() => {
    if (!chatId) return;
    
    socket.emit('join_notifications', { chat: chatId });
    
    const eventRead = (chat) => {
      if (chat === chatId) {
        getUnreadMessagesCount(chatId)
          .then(res => setUnreadMessages(res.data));
      }
    }
    
    const eventNotification = (data) => {
      const { chat, to } = data;
      
      if (chat === chatId && chat !== chatBoxId && to.includes(user.id)) {
        setUnreadMessages(unreadMessages + 1);
      }
    }
    
    socket.on('messages_read', eventRead);
    socket.on('message_new', eventNotification);
    
    return () => {
      socket.off('messages_read', eventRead);
      socket.off('message_new', eventNotification);
      socket.emit('leave_notifications', { chat: chatId });
    }
  }, [socket, chatId, user.id, unreadMessages, chatBoxId]);
  
  const handleClick = () => {
    setChatBoxId(chatId);
  }
  
  return (
    <div className={`contact ${unreadMessages > 0 ? 'contact-notification' : ''}`} onClick={handleClick}>
      <img src={nameplateUser.pfp && nameplateUser.pfp.length > 0 ? nameplateUser.pfp : icons.account} alt='Profile' />
      <span>{ nameplateUser.first_name + ' ' + nameplateUser.last_name }</span>
      <p style={{
        textAlign: 'right',
        margin: '0',
        marginLeft: 'auto',
        padding: '0',
        paddingRight: '8px'
      }}>{unreadMessages === 0 ? '' : unreadMessages}</p>
    </div>
  );
}

export default UserNameplate;