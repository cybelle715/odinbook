const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, minLength: 1, maxLength: 255, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Comment', CommentSchema);