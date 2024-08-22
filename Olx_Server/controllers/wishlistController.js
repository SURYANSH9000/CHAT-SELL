const wishlistService = require('../services/wishlistService');

async function addToWishlist(req, res) {
  try {
    const { userId, productId } = req.body;
    const result = await wishlistService.addToWishlist(userId, productId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).send("Internal server error");
  }
}

async function getWishlistByUserId(req, res) {
  try {
    const { userId } = req.params;
    const wishlist = await wishlistService.getWishlistByUserId(userId);
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).send("Internal server error");
  }
}

async function removeFromWishlist(req, res) {
  try {
    const { userId, productId } = req.params;
    await wishlistService.removeFromWishlist(userId, productId);
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist
};
