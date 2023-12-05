const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // This will prevent the password field from being returned by default

  }
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  // Search for a user by email.
  const user = await this.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Unable to login');
  }

  // Compare the provided password with the hashed password in the database.
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }

  // Return the user if the password matches.
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
