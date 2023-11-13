const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, minLength: 1, maxLength: 255, required: true },
  read: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Message', MessageSchema);