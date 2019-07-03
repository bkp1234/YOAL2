const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  Bookinginfo: {
    type: String,
    required: true
  },
  social: {
    twitter: {
      type: String
    },
    facebook: {
      type: String
    }
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ]
});

// we must export man
module.exports = Userprof = mongoose.model('userprof', ProfileSchema);
