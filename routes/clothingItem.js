// clothingItem.js in routes folder
const router = require('express').Router();
const { createItem, getItems, updateItem, deleteItem, likeItem, unlikeItem } = require('../controllers/clothingItem')

// Existing CRUD operations
router.post('/', createItem);
router.get('/', getItems);
router.delete('/:itemId', deleteItem); // Add this if deleteItem is implemented

// Like and unlike routes
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', unlikeItem);

module.exports = router;
