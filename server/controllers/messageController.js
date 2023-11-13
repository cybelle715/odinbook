const Message = require('../models/message');
const Chat = require('../models/chat');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const { generateUserData } = require('../utils/miscellaneous');
const { emit } = require('../utils/SocketIO');
const mongoose = require('mongoose');

const createChat = async (user, users) => {
  let chat = new Chat({
    users: [user._id, ...users]
  });
  
  chat = await chat.save();
  
  return chat;
}

exports.getMessages = async (req, res, next) => {
  Message.find({ chat: new mongoose.Types.ObjectId(req.query.id) }).sort({ date: -1 }).limit(req.query.limit ? -req.query.limit : -100).populate('sender')
    .then(messages => {
      const result = messages?.map(message => {
        return {
          message: message.text,
          user: generateUserData(message.sender),
          date: message.date
        }
      });
      
      if (messages.length > 0) {
        Message.updateMany({ chat: req.query.id }, { $addToSet: { read: req.user._id } }, { multi: true, upsert: true })
          .then(() => emit(req.query.id, 'messages_read', req.query.id));
      }
      
      res.status(200).json(result ? result : []);
    })
    .catch(err => next(err));
}

exports.addMessage = [
  body('message', 'Message must be between 1 and 255 characters.')
    .trim()
    .isLength({ min: 1, max: 255 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array({ onlyFirstError: true }).map(err => err.msg) });
    }
    
    try {
      const chat = await Chat.findOne({ _id: req.body.id });
      
      const message = new Message({
        chat: chat._id,
        text: req.body.message,
        sender: req.user._id,
        date: Date.now(),
        read: [req.user._id]
      });
      
      message.save()
        .then(message => {
          User.findOne({ _id: message.sender })
            .then(user => {
              emit(req.body.id, 'message_new', { chat: req.body.id, to: chat.users.reduce((users, user) => user.toString() == message.sender.toString() ? users: [...users, user], []) }, { notification: true });
              
              res.status(200).json({ 
                message: message.text,
                user: generateUserData(user),
                date: message.date
              });
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    } catch(err) {
      next(err);
    }
  }
];

exports.getUnreadMessagesCount = (req, res, next) => {
  Message.find({ chat: new mongoose.Types.ObjectId(req.query.id) }).populate('sender')
    .then(messages => {
      const result = messages?.filter(message => !message.read.includes(req.user._id)).map(message => {
        return {
          message: message.text,
          user: generateUserData(message.sender),
          date: message.date
        }
      });
      
      res.status(200).json(result ? result.length : 0);
    })
    .catch(err => next(err));
}

exports.getChatId = async (req, res, next) => {
  if (!req.query.users) return res.status(400).send();
  
  try {
    let chat = await Chat.findOne({ users: { $all: [req.user._id, ...req.query.users] } });
    
    if (!chat) chat = await createChat(req.user, req.query.users);
    
    return res.status(200).json(chat._id);
  } catch(err) {
    next(err);
  }
}