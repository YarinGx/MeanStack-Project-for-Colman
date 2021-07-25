const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  hash: String,
  salt: String,
  role: String,
  email: String
});

mongoose.model('User', UserSchema);
