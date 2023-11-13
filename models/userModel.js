const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [30, 'Name must be at most 30 characters long']
  },
  avatar: {
    type: String,
    required: [true, 'Avatar URL is required'],
    validate: {
      validator: (v) => validator.isURL(v, { protocols: ['http','https'], require_protocol: true }),
      message: 'Avatar must be a valid URL'
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
