import './styles/App.css';
import LoginPage from './components/LoginPage';
import UserContext from './contexts/UserContext';
import SocketContext from './contexts/SocketContext';
import { useState, useEffect } from "react";
import HomePage from './components/HomePage/HomePage';
import LoadingIcon from './components/LoadingIcon';
import { checkLogin } from './apis/userAPI';
import { ModalProvider } from './contexts/ModalContext';
import NavBar from './components/NavBar/NavBar';
import UserPage from './components/UserPage/UserPage';
import ChatBox from './components/ChatBox/ChatBox';
import ChatContext from './contexts/ChatContext';
import io from 'socket.io-client';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

const SERVER = process.env.REACT_APP_SERVER;
const socket = io.connect(SERVER);

const defaultUser = {
  username: '',
  loggedIn: false
}

function App() {
  const [user, setUser] = useState(defaultUser);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(<HomePage />);
  const [chatBoxId, setChatBoxId] = useState(null);
  const [userPageId, setUserPageId] = useState(null);
  
  useEffect(() => {
    if (!loading) return;
    
    checkLogin()
      .then(res => {
        setUser({
          ...res.data,
          loggedIn: true
        })
      })
      .catch(() => {
        setUser({ loggedIn: false });
      })
      .finally(() => setLoading(false));
  }, [loading]);
  
  useEffect(() => {
    socket.emit('join_updates');
    
    return () => {
      socket.emit('leave_updates');
    }
  }, []);
  
  useEffect(() => {
    if (userPageId) setCurrentPage(<UserPage />);
    else setCurrentPage(<HomePage />);
  }, [userPageId]);
  
  return (
    <SocketContext.Provider value={{ socket }}>
      <UserContext.Provider value={{ user, setUser, userPageId, setUserPageId }}>
        <ChatContext.Provider value={{ chatBoxId, setChatBoxId }}>
          <ModalProvider>
            <ThemeProvider>
              <div className="App">
                {loading ? null : user.loggedIn ? <NavBar /> : null}
                
                {
                  loading ? <LoadingIcon /> : 
                    user.loggedIn ? currentPage : <LoginPage reload={setLoading} />
                }
                
                { chatBoxId && user.loggedIn ? <ChatBox /> : null }
                
                <Footer />
              </div>
            </ThemeProvider>
          </ModalProvider>
        </ChatContext.Provider>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;
