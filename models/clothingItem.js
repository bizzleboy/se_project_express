const mongoose = require('mongoose');
const validator = require('validator');

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  weather: {
    type: String,
    required: true,
    enum: ['hot', 'warm', 'cold']
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'URL is not valid'
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [] // Empty array by default
  }],
  createdAt: {
    type: Date,
    default: Date.now // Defaults to the current date and time
  }
});

module.exports = mongoose.model('ClothingItem', clothingItem);
