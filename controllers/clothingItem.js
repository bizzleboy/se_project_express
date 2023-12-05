const ClothingItem = require('../models/clothingItem');
// clothingItemController.js
const { 
    STATUS_OK, 
    STATUS_CREATED, 
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
        return res.status(STATUS_OK).send({ message: 'Item successfully deleted', data: item });
      })
      .catch(err => {
        if (err.name === 'CastError') {
          return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID format' });
        }
        // No need for an else block here because if the above if condition is true, the function will exit
        return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error deleting item' });
      });
      
  };
  
  
  const likeItem = (req, res) => {
    const { itemId } = req.params; // Destructuring req.params
    const { _id: userId } = req.user; // Destructuring req.user and renaming _id to userId
  
    ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    )
    .then(item => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.status(STATUS_OK).send({ data: item }); // Return statement for when item exists
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID format' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error liking item' });
    });
  };
  
  
  
  const unlikeItem = (req, res) => {
    const { itemId } = req.params; // Destructured assignment for itemId
    const { _id: userId } = req.user; // Destructured assignment for userId, and renaming _id to userId
  
    ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    )
    .then(item => {
      if (!item) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Item not found' });
      }
      return res.status(STATUS_OK).send({ data: item }); // Return statement for when item exists
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Invalid item ID format' });
      }
      // Make sure to handle other types of errors as well
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error unliking item' });
    });
  };
  
  
module.exports = {
    createItem,
    getItems,
    deleteItem, // only add this if you have a deleteItem function defined
    likeItem,
    unlikeItem
};

