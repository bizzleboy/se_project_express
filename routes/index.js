const express = require('express');
const router = express.Router();

const clothingItemRoutes = require('./clothingItem');
const userRoutes = require('./userRoutes');
const { STATUS_NOT_FOUND } = require('../utils/constants');

router.use('/items', clothingItemRoutes);
router.use('/users', userRoutes);

router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: "Sorry, that route doesn't exist." });
});

module.exports = router;