import { addLike } from "../../apis/postsAPI";
import Comments from "./Comments";
import { useContext, useState } from "react";
import UserProfilePicture from "../UserProfilePicture";
import UserName from "../UserName";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import UserContext from "../../contexts/UserContext";
import { ThemeContext } from "../../contexts/ThemeContext";
dayjs.extend(relativeTime);

const Post = ({ post, updatePost }) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(UserContext);
  const { icons } = useContext(ThemeContext);
  
  const handleLike = (e) => {
    e.target.classList.contains('liked') ? e.target.classList.remove('liked') : e.target.classList.add('liked');
    
    addLike(post.id)
      .then(res => {
        res.data.liked ? e.target.classList.add('liked') : e.target.classList.remove('liked');
        updatePost({ ...post, likes: res.data.likes });
      });
  }

  const handleComments = () => {
    setShowComments(!showComments);
  }
  
  return (
    <div className="post card">
      <div className='post-content'>
        <div className="post-user">
          <UserProfilePicture pfp={post.user.id === user.id ? user.pfp : post.user.pfp} id={post.user.id} />
          
          <div className="post-user-info">
            <UserName full_name={`${post.user.first_name} ${post.user.last_name}`} id={post.user.id} />
            <span>{dayjs(post.date).fromNow()}</span>
          </div>
        </div>
        
        <span className='post-message'>{post.message}</span>
        { post.photo && post.photo.length > 0 ? <img className='post-photo' src={post.photo} alt='Post' /> : null}
        
        <div className="post-details">
          <div className='post-likes'>
            <img src={icons.like} alt='Like' />
            <span>{post.likes}</span>
          </div>
          <span className='post-comments' onClick={handleComments}>{post.commentsCount} comments</span>
        </div>
      </div>
      
      <hr />
      
      <div className="post-options">
        <button className={"btn btn-transparent btn-no-shadow" + (post.liked ? ' liked' : '')} type="button" onClick={handleLike}>Like</button>
        <button className="btn btn-transparent btn-no-shadow" type="button" onClick={handleComments}>Comment</button>
      </div>
      
      {
        showComments ? <Comments id={post.id} commentsCount={post.commentsCount} updateCommentsCount={(commentsCount) => post.commentsCount = commentsCount} /> : null
      }
    </div>
  );
}

export default Post;