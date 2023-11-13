import { useContext, useEffect, useState } from 'react';
import '../../styles/Posts.css';
import UserContext from '../../contexts/UserContext';
import { ModalContext } from '../../contexts/ModalContext';
import PostForm from './PostForm';
import '../../styles/SVG.css';
import LoadingIcon from '../LoadingIcon';
import { getPosts } from '../../apis/postsAPI';
import Post from './Post';
import { ThemeContext } from '../../contexts/ThemeContext';

const Posts = () => {
  const { user } = useContext(UserContext);
  const { handleModal } = useContext(ModalContext);
  const { icons } = useContext(ThemeContext);
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const [posts, setPosts] = useState([]);
  
  
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.scrollingElement.scrollHeight) {
        if (postsLoaded) return;
        
        setLoadingMore(true);
        
        getPosts(posts && posts.length > 0 ? posts[posts.length - 1].date : null)
          .then(res => {
            if (res.data && res.data.length === 0) setPostsLoaded(true);
            setPosts(res.data ? posts.concat(res.data) : posts);
          })
          .finally(() => setLoadingMore(false));
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [posts, postsLoaded]);
  
  useEffect(() => {
    if (!loading) return;
    
    getPosts(posts && posts.length > 0 ? posts[posts.length - 1].date : null)
      .then(res => {
        setPosts(res.data ? res.data : []);
      })
      .finally(() => setLoading(false));
  }, [loading, posts]);
  
  const updatePost = (index, update) => {
    const updatedPosts = [...posts];
    updatedPosts[index] = update;
    
    setPosts(updatedPosts);
  }
  
  return (
    loading ? <LoadingIcon /> :
      <div className="posts">
        <div className="post card post-input">
          <input readOnly={true} type="text" placeholder={`What's on your mind, ${user.first_name}?`} value={message} onFocus={() => handleModal(<PostForm message={message} setMessage={setMessage} reload={setLoading} />)} />
          <img className="svg" src={icons.send} alt="Arrow Right" />
        </div>
        
        {
          posts.map((post, index) => {
            return (
              <Post key={index} post={post} updatePost={(update) => updatePost(index, update)} />
            );
          })
        }
        
        {
          loadingMore ? <LoadingIcon /> : null
        }
      </div>
  );
}

export default Posts;