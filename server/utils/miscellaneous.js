const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

exports.generateUserData = (user, req) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name,
    pfp: user.pfp.includes('http') ? user.pfp : `${req.protocol + '://' + req.get('host')}/${user.pfp}`
  }
}

exports.generatePost = (post, req, commentsCount) => {
  return {
    id: post._id,
    message: post.message,
    likes: post.likes.length,
    liked: post.likes.indexOf(req.user._id) !== -1 ? true : false,
    posts: post.likes.length,
    date: post.date,
    user: this.generateUserData(post.user),
    photo: post.photo.includes('http') ? post.photo : (post.photo === '' ? post.photo : `${req.protocol + '://' + req.get('host')}/${post.photo}`),
    commentsCount: commentsCount
  }
}

exports.generateComment = (comment) => {
  return {
    comment: comment.comment,
    user: this.generateUserData(comment.user),
    date: comment.date
  }
}