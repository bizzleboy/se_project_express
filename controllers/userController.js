const { 
    STATUS_OK, 
    STATUS_CREATED, 
    STATUS_BAD_REQUEST, 
    STATUS_NOT_FOUND, 
    STATUS_INTERNAL_SERVER_ERROR 
  } = require('../utils/constants');
  
  const bcrypt = require('bcrypt');
const saltRounds = 10;
const { JWT_SECRET } = require('../utils/config'); // Ensure you have this constant defined in your config
const jwt = require('jsonwebtoken');

// userController.js
const User = require('../models/userModel');


// Add your User model methods similar to the ClothingItem model

const createUser = async (req, res) => {
  // Destructure all required fields from the request body
  const { name, avatar, email, password } = req.body;

  try {
      // Check for an existing user with the same email
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
          return res.status(STATUS_BAD_REQUEST).send({ message: 'Email already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Now pass all fields including the hashed password to the User.create method
      const user = await User.create({ name, avatar, email, password: hashedPassword });
      res.status(STATUS_CREATED).send({ data: user });
  } catch (err) {
      if (err.code === 11000) { // MongoDB duplicate error code
          res.status(STATUS_BAD_REQUEST).send({ message: 'Email already exists' });
      } else if (err.name === 'ValidationError') {
          res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid data passed' });
      } else {
          res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error creating user' });
      }
  }
};


const getUser = (req, res) => {
    const { userId } = req.params;
  
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
        }
        return res.status(STATUS_OK).send({ data: user }); // Ensuring a return here
      })
      .catch(err => {
        if (err.name === 'CastError') {
          return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user ID format' });
        }
        return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error retrieving user' }); // Ensuring a return here
      });
  };
  

const getUsers = ( res) => {
    User.find({})
        .then(users => res.status(STATUS_OK).send({ data: users }))
        .catch(res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error retrieving users' }));
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Explicitly select the password field which is set to select: false in the schema
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.send({ token });
  } catch (error) {
    res.status(401).send({ message: 'Invalid email or password' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Fetch the user data without the password
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({ data: user });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving user data' });
  }
};


const updateUserProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'avatar'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ message: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    updates.forEach((update) => user[update] = req.body[update]);
    await user.save(); // This will run validators defined in your schema

    res.send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Validation error' });
    } else {
      res.status(500).send({ message: 'Error updating user' });
    }
  }
};

const deleteClothingItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user._id; // Assuming this is set by your authentication middleware

    // Find the clothing item by ID
    const item = await ClothingItem.findById(itemId);
    
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }

    // Check if the logged-in user's _id matches the item owner's _id
    if (item.owner.toString() !== userId.toString()) {
      return res.status(403).send({ message: 'You do not have permission to delete this item' });
    }

    // If the user is the owner, proceed with deletion
    await item.remove();
    res.send({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting item' });
  }
};
// You can add more user-related functionality as needed

module.exports = {
    createUser,
    getUser,
    login,
    getUsers,
    getCurrentUser,
    updateUserProfile,
    deleteClothingItem,
};
