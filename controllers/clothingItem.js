const ClothingItem = require('../models/clothingItem');
// clothingItemController.js
const { 
    STATUS_OK, 
    STATUS_CREATED, 
    STATUS_NO_CONTENT, 
    STATUS_BAD_REQUEST, 
    STATUS_NOT_FOUND, 
    STATUS_INTERNAL_SERVER_ERROR 
} = require('../utils/constants');

// ... your controller methods using these status constants

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const ownerId = req.user._id;  // Extract the user's ID from req.user

  ClothingItem.create({ name, weather, imageUrl, owner: ownerId })  // Add the owner field
      .then(item => {
          res.status(STATUS_CREATED).send({ data: item });
      })
      .catch(err => {
          if (err.name === 'ValidationError') {
              res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid data passed' });
          } else {
              res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error creating item' });
          }
      });
};

const getItems = (req, res) => {
    ClothingItem.find({})
      .then(items => res.status(STATUS_OK).send(items))
      .catch(() => {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: "Error retrieving items" });
      });
  };
  

  
  const deleteItem = (req, res) => {
    const { itemId } = req.params;
  
    ClothingItem.findByIdAndDelete(itemId)
      .then(item => {
        if (!item) {
          return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
        }
        // Send a 200 status code and include the deleted item in the response
        res.status(STATUS_OK).send({ message: 'Item successfully deleted', data: item });
      })
      .catch(err => {
        if (err.name === 'CastError') {
          res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID format' });
        } else {
          res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error deleting item' });
        }
      });
  };
  
  

  
  const likeItem = (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.user._id;
  
    ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    )
    .then(item => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      res.status(STATUS_OK).send({ data: item });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID format' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error liking item' });
      }
    });
  };
  
  const unlikeItem = (req, res) => {
    const itemId = req.params.itemId;
    const userId = req.user._id;
  
    ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    )
    .then(item => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      res.status(STATUS_OK).send({ data: item });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID format' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error unliking item' });
      }
    });
  };
module.exports = {
    createItem,
    getItems,
    deleteItem, // only add this if you have a deleteItem function defined
    likeItem,
    unlikeItem
};

