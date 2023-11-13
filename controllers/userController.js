const { 
    STATUS_OK, 
    STATUS_CREATED, 
    STATUS_BAD_REQUEST, 
    STATUS_NOT_FOUND, 
    STATUS_INTERNAL_SERVER_ERROR 
  } = require('../utils/constants');
  
// userController.js
const User = require('../models/userModel');

// Add your User model methods similar to the ClothingItem model

const createUser = (req, res) => {
    // Destructure name and avatar from the request body, assuming avatar is being sent in the request
    const { name, avatar } = req.body;
    
    // Only name and avatar are now passed to the User.create method
    User.create({ name, avatar })
        .then((user) => {
            res.status(STATUS_CREATED).send({ data: user }); // Use the constant for 201
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid data passed' }); // Use STATUS_BAD_REQUEST for validation errors
            } else {
                res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error creating user' }); // Use STATUS_INTERNAL_SERVER_ERROR for server errors
            }
        });
};



const getUser = (req, res) => {
    const { userId } = req.params;

    User.findById(userId)
        .then((user) => {
            if (!user) {
                return res.status(STATUS_NOT_FOUND).send({ message: 'User not found' });
            }
            res.status(STATUS_OK).send({ data: user });
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid user ID format' });
            } else {
                res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error retrieving user' });
            }
        });
};


const getUsers = (req, res) => {
    User.find({})
        .then(users => res.status(STATUS_OK).send({ data: users }))
        .catch(err => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error retrieving users' }));
};




// You can add more user-related functionality as needed

module.exports = {
    createUser,
    getUser,


    getUsers
};
