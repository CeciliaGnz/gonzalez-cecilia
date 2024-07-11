const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {type: ObjectId},
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {type: Object},
  type: {type: String}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
