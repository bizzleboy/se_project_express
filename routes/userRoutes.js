const express = require('express');
const router = express.Router();

// Import your user controller functions
const { 
    createUser, 
    getUser, 
    getUsers, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');

// Get all users
router.get('/', getUsers);

// Get a single user by _id
router.get('/:userId', getUser);

// Create a new user
router.post('/', createUser);


module.exports = router;
