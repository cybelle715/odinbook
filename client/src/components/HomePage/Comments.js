import '../../styles/Comments.css';
import '../../styles/Button.css';
import ArrowRight from '../../assets/images/arrow-right.svg';
import { useState, useEffect, useContext } from "react";
import LoadingIcon from '../LoadingIcon';
import { getComments, addComment } from '../../apis/postsAPI';
import UserProfilePicture from '../UserProfilePicture';
import UserName from '../UserName';
import { ModalContext } from '../../contexts/ModalContext';
import ErrorModal from '../ErrorModal';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const commentsLimit = 10;

const Comments = ({ id, commentsCount, updateCommentsCount }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [commentsLoadMore, setCommentsLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { handleModal } = useContext(ModalContext);
  
  useEffect(() => {
    if (!loading) return;
    
    getComments(id, commentsLimit)
      .then(res => {
        setComments(res.data ? res.data : []);
      })
      .finally(() => setLoading(false));
  }, [id, loading]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    addComment(id, comment)
      .then(res => {
        setComments([...comments, res.data]);
        updateCommentsCount((comments ? comments.length : 0) + 1);
      })
      .catch(err => handleModal(<ErrorModal errors={err.response.data.errors } />))
      .finally(() => setComment(''));
  }
  
  const handleChange = (e) => {
    setComment(e.target.value);
  }
  
  const handleLoadMoreComments = () => {
    setCommentsLoadMore(false);
    setLoadingMore(true);
    
    getComments(id, commentsLimit, comments.length)
      .then(res => {
        if (comments.length + res.data.length >= commentsCount) setCommentsLoadMore(false)
        else setCommentsLoadMore(true);
        
        setComments(res.data ? [...res.data, ...comments] : comments);
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }
  
  return (
    <>
      <hr />
      
      <div className="comments-cnt">
        {
          loading ? <LoadingIcon /> :
            <>
              { loadingMore ? <LoadingIcon /> : null }
              { commentsLoadMore ? <button className='btn btn-wide btn-transparent btn-no-shadow btn-text-colored btn-text-bold' onClick={handleLoadMoreComments}>Load more comments</button> : null }
              <div className="comments">
                {
                  comments.map((comment, index) => {
                    return (
                      <div key={index} className='comment'>
                        <UserProfilePicture pfp={comment.user.pfp} />
                        <div className='comment-text'>
                          <UserName full_name={`${comment.user.first_name} ${comment.user.last_name}`} id={comment.user.id} />
                          <span>{comment.comment}</span>
                          <span style={{ fontSize: '12px' }}>({dayjs(comment.date).fromNow()})</span>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </>
        }
        
        <form className="post-input" onSubmit={handleSubmit}>
          <input type="text" placeholder='Write a comment...' value={comment} onChange={handleChange} />
          <button type='submit' className='btn-transparent btn-no-border'><img className="svg" src={ArrowRight} alt="Arrow Right" /></button>
        </form>
      </div>
    </>
  );
}

export default Comments;