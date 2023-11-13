const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');
const { generatePost, generateComment } = require('../utils/miscellaneous');

exports.get_posts_all = async (req, res, next) => {
  try {
    const posts = await Promise.all((await Post.find(req.query.fromDate ? { date: { $lt: req.query.fromDate }} : {}).populate('user').sort({ 'date': -1 }).limit(10)).map(async post => {
      let comments = await Comment.find({ post: post._id });
      
      return generatePost(post, req, comments.length);
    }));
    
    res.status(200).json(posts);
  } catch(err) {
    next(err);
  }
}

exports.get_posts_user = async (req, res, next) => {
  try {
    const posts = await Promise.all((await Post.find(req.query.fromDate ? { user: req.query.id, date: { $lt: req.query.fromDate }} : { user: req.query.id }).populate('user').sort({ 'date': -1 }).limit(10)).map(async post => {
      let comments = await Comment.find({ post: post._id });
      
      return generatePost(post, req, comments.length);
    }));
    
    res.status(200).json(posts);
  } catch(err) {
    next(err);
  }
}

exports.get_comments = (req, res, next) => {
  Comment.find({ post: req.query.id }).sort({ date: -1 }).skip(req.query.skip).limit(req.query.limit).populate('user')
    .then(comments => {
      res.status(200).json(comments ? comments.map(comment => generateComment(comment)).reverse() : []);
    })
    .catch(err => next(err));
}

exports.get_comments_count = (req, res, next) => {
  Comment.find({ post: req.query.id })
    .then(comments => res.status(200).json(comments ? comments.length : 0))
    .catch(err => next(err));
}

exports.add_comment = [
  body('comment', 'Comment must be between 1 and 255 characters.')
    .trim()
    .isLength({ min: 1, max: 255 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array({ onlyFirstError: true }).map(err => err.msg)
      });
    }
    
    const comment = new Comment({
      user: req.user._id,
      comment: req.body.comment,
      post: req.body.id,
      date: Date.now()
    });
    
    comment.save()
      .then(comment => res.status(200).json(generateComment({ comment: comment.comment, date: comment.date, user: req.user })))
      .catch(err => next(err));
  }
]

exports.post = [
  body('message', 'Message must be between 1 and 1000 characters.')
    .trim()
    .isLength({ min: 1, max: 255 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array({ onlyFirstError: true }).map(err => err.msg)
      });
    }
    
    const post = new Post({
      message: req.body.message,
      user: req.user._id,
      date: Date.now(),
      likes: [],
      comments: [],
      photo: req.file ? req.file.path : ''
    });
    
    post.save()
      .then(post => res.status(200).json(generatePost(post, req)))
      .catch(err => next(err));
  }
]

exports.like = (req, res, next) => {
  Post.findOne({ _id: req.body.id })
    .then(post => {
      let liked = true;
      
      if (post.likes.indexOf(req.user._id) !== -1) {
        post.likes.pull(req.user._id);
        liked = false;
      } else {
        post.likes.push(req.user._id);
      }
      
      post.save()
        .then(() => res.status(200).json({
          likes: post.likes.length,
          liked
        }));
    });
}

exports.liked = (req, res, next) => {
  Post.findOne({ _id: req.body.id })
    .then(post => {
      if (post.likes.indexOf(req.user._id) !== -1) return res.status(200).json({ liked: true });
      res.status(200).json({ liked: false });
    });
}

exports.get_likes = (req, res, next) => {
  Post.findOne({ _id: req.body.id })
    .then(post => res.status(200).json({ likes: post.likes.length }));
}