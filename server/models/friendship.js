const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({
  friendship: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  pending: { type: Boolean, default: true }
});

module.exports = mongoose.model('Friendship', FriendshipSchema);