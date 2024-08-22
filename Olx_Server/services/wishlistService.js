const mongodbConnection = require('../utils/helperFunctions/mongodbConnection');

async function addToWishlist(userId, productId) {
  const wishlistCollection = await mongodbConnection('wishlist');

  // Check if the item is already in the wishlist
  const existingItem = await wishlistCollection.findOne({ userId, productId });
  if (existingItem) {
    throw new Error('Item already in wishlist');
  }

  const newItem = {
    userId,
    productId,
    createdAt: new Date()
  };

  const result = await wishlistCollection.insertOne(newItem);
  if (!result.acknowledged || !result.insertedId) {
    throw new Error('Failed to add to wishlist');
  }

  return newItem;
}

async function getWishlistByUserId(userId) {
  const wishlistCollection = await mongodbConnection('wishlist');
  const wishlist = await wishlistCollection.find({ userId }).toArray();
  return wishlist.map(item => item.productId);
}

async function removeFromWishlist(userId, productId) {
  const wishlistCollection = await mongodbConnection('wishlist');
  const result = await wishlistCollection.deleteOne({ userId, productId });
  if (result.deletedCount === 0) {
    throw new Error('Failed to remove item from wishlist');
  }
}

module.exports = {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist
};
