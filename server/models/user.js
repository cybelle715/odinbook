const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: { type: String, minLength: 3, required: true, unique: true },
  password: { type: String, minLength: 8, required: true },
  first_name: { type: String, minLength: 2, required: true },
  last_name: { type: String, minLength: 2, required: true },
  full_name: { type: String },
  age: { type: Number, minValue: 13, required: true },
  pfp: { type: String }
});

UserSchema.pre('save', function(next) {
  
  if (this.isModified('password')) {
    const hash = bcrypt.hashSync(this.password, 10);
    this.password = hash;
  }
  
  if (this.isModified('first_name') || this.isModified('last_name')) this.full_name = `${this.first_name} ${this.last_name}`;
  
  next();
});

UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", UserSchema);