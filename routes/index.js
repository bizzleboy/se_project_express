const express = require('express');
const { createUser, login, getCurrentUser, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const { STATUS_NOT_FOUND } = require('../utils/constants');

const router = express.Router();

const clothingItemRoutes = require('./clothingItem');

// Public routes
router.post('/signin', login);
router.post('/signup', createUser);
router.use('/items', clothingItemRoutes);

// Protected routes
router.get('/users/me', authMiddleware, getCurrentUser);

// Handle non-existing routes
router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: "Sorry, that route doesn't exist." });
});
router.patch('/users/me', authMiddleware, updateUserProfile);

module.exports = router;
