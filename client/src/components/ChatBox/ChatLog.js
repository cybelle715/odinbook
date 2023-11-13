import LoadingIcon from "../LoadingIcon";
import { useState, useEffect, useReducer, useContext } from "react";
import { getMessages } from "../../apis/chatAPI";
import UserName from "../UserName";
import UserProfilePicture from "../UserProfilePicture";
import SocketContext from '../../contexts/SocketContext';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import ChatContext from "../../contexts/ChatContext";
import UserContext from "../../contexts/UserContext";
dayjs.extend(relativeTime);

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.messages;
    case 'ADD':
      if (state.length === 0) return [[action.message]];
      return state[0][0].user.id === action.message.user.id ? state.map((groupedMessages, index) => index === 0 ? [...groupedMessages, action.message] : groupedMessages) : [[action.message]].concat(state);
    default:
      return state;
  }
}
/*
* A simple function to group messages sent by the same user into blocks
*/

const groupData = (dataToGroup) => {
  const data = dataToGroup; //dataToGroup.toReversed();
  
  let dataGrouped = [];
  
  for (let i = 0, arr = []; i < data.length; ++i) {
    arr.push(data[i]);
    
    if (i < data.length - 1 && data[i].user.id === data[i + 1].user.id)
      continue;
    
    dataGrouped.push(arr.reverse());
    arr = [];
  }
  
  return dataGrouped;
}

const ChatLog = () => {
  const [messages, dispatch] = useReducer(reducer, []);
  const [messagesCount, setMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [scrollReachedTop, setScrollReachedTop] = useState(false);
  const { socket } = useContext(SocketContext);
  const { chatBoxId } = useContext(ChatContext);
  const { user } = useContext(UserContext);
  
  /**
   * This useEffect loads the initial 100 most recent messages
   */
 
  useEffect(() => {
    if (!chatBoxId) return;
    
    getMessages(chatBoxId)
      .then(res => {
        setMessagesCount(res.data.length);
        const dataGrouped = groupData(res.data);
        
        dispatch({ type: 'SET', messages: dataGrouped });
      })
      .finally(() => setLoading(false));
  }, [loading, chatBoxId]);
  
  
  /**
   * 
   * This useEffect handles the adding of new messages received from the other user
   * The message also gets added to the database, but we use socket io to circumvent database calls
   */
  
  useEffect(() => {
    const eventListener = (message) => {
      setMessagesCount(messagesCount + 1);
      dispatch({ type: 'ADD', message });
    }
    
    socket.on('receive_message', eventListener);
    
    return () => socket.off('receive_message', eventListener);
  }, [socket, messagesCount]);
  
  
  /**
   * This useEffect handles the loading of previous messages once the user scrolls to the top of the chat window
   */
 
  useEffect(() => {
    const chatWindow = document.querySelector('.chatbox-log');
    
    const handleScroll = () => {
      if (finishedLoading) return;
      
      if (!scrollReachedTop && chatWindow.clientHeight + (-chatWindow.scrollTop) + 1 >= chatWindow.scrollHeight) {
        setScrollLoading(true);
        setScrollReachedTop(true);
        
        getMessages(chatBoxId, messagesCount + 10)
          .then(res => {
            if (res.data && res.data.length > 0) {
              if (res.data.length === messagesCount) setFinishedLoading(true);
              
              setMessagesCount(res.data.length);
              dispatch({ type: 'SET', messages: groupData(res.data) });
            }
          })
          .finally(() => setScrollLoading(false));
      } else if (scrollReachedTop && chatWindow.clientHeight + (-chatWindow.scrollTop) + 1 <= chatWindow.scrollHeight) setScrollReachedTop(false);
    }
    
    chatWindow.addEventListener('scroll', handleScroll);
    
    return () => {
      chatWindow.removeEventListener('scroll', handleScroll);
    };
  }, [finishedLoading, messages, scrollReachedTop, chatBoxId, messagesCount]);
  
  return (
    <ul className="chatbox-log">
        {
          loading ? <LoadingIcon /> :
            <>
              {
                messages.map((messageGroup, indexGroup) => {
                  return (
                    <li className={`log ${messageGroup[0].user.id === user.id ? 'current-user': ''}`} key={indexGroup}>
                      { messageGroup[0].user.id === user.id ? null : <UserProfilePicture id={messageGroup[0].user.id} pfp={messageGroup[0].user.pfp} /> }
                      
                      <div className='log-cnt'>
                        <div className='log-header'>
                          { messageGroup[0].user.id === user.id ? null : <UserName id={messageGroup[0].user.id} full_name={messageGroup[0].user.full_name} /> }
                          <p className="log-date">{ dayjs(messageGroup[messageGroup.length - 1].date).fromNow() }</p>
                        </div>
                        
                        <div className={`log-content ${messageGroup[0].user.id === user.id ? 'current-user': ''}`}>
                          {
                            messageGroup.map((message, index) => {
                              return <span className='log-message' key={index}>{message.message}</span>
                            })
                          }
                        </div>
                      </div>
                    </li>
                  )
                })
              }
              
              { scrollLoading ? <LoadingIcon /> : null }
            </>
        }
      </ul>
  );
}

export default ChatLog;