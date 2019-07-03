const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // we can add new fields to the user like last name first name
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
// here User is the variable
//user in the moongoss.model is the modelname
module.exports = User = mongoose.model('user', UserSchema);
