const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  message: { type: String, minLength: 1, maxLength: 1000, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  photo: { type: String }
});

module.exports = mongoose.model('Post', PostSchema);