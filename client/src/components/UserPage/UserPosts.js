import '../../styles/Posts.css';
import { useState, useEffect, useContext } from "react";
import { getPostsUser } from '../../apis/postsAPI';
import Post from '../HomePage/Post';
import LoadingIcon from '../LoadingIcon';
import UserContext from '../../contexts/UserContext';

const UserPosts = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { userPageId } = useContext(UserContext);
  
  useEffect(() => {
    if (!userPageId) return;
    
    getPostsUser(userPageId)
      .then(res => 
        {
          setPosts(res.data ? res.data : []);
        })
      .finally(() => setLoading(false));
  }, [loading, userPageId]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.scrollingElement.scrollHeight) {
        if (postsLoaded) return;
        
        setLoadingMore(true);
        
        getPostsUser(userPageId, posts && posts.length > 0 ? posts[posts.length - 1].date : null)
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
  }, [posts, userPageId, postsLoaded]);
  
  return (
    <div className="posts posts-narrow">
      {
        loading ? <LoadingIcon /> :
          (!posts || posts.length === 0) ? null :
          <>
            {
              posts.map((post, index) => {
                return <Post key={index} post={post} />;
              })
            }
            {
              loadingMore ? <LoadingIcon /> : null
            }
          </>
      }
    </div>
  );
}

export default UserPosts;