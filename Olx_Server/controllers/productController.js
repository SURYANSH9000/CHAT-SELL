const { ObjectId } = require('mongodb');
const productService = require('../services/productService');


async function listProducts(req, res) {
  try {
    const { page = 1, limit = 20, excludeUserId, searchQuery,locationQuery } = req.query;
    const products = await productService.listProducts({
      page: parseInt(page),
      limit: parseInt(limit),
      excludeUserId: excludeUserId ? excludeUserId : null,
      searchQuery: searchQuery ? searchQuery : '',
      locationQuery: locationQuery ? locationQuery : ''
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).send("Internal server error");
  }
}

const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    const imageFiles = req.files; 
    const newProduct = await productService.addProduct(productData, imageFiles);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding product' });
  }
};


async function getProductById(req, res) {
  try {
    const id = req.params.id;
    console.log('Fetching product by id:', id);
    const product = await productService.getProductById(id);
    console.log('Product:', product);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).send("Internal server error");
  }
}

async function getProductsByUserId(req, res) {
  try {
    const userId = req.params.userId;
    console.log('Fetching products by user ID:', userId);
    const products = await productService.getProductsByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by user ID:', error);
    res.status(500).send("Internal server error");
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const productData = req.body;
    const imageFiles = req.files;

    const updatedProduct = await productService.updateProduct(id, productData, imageFiles);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
}

const sponsorAd = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = await productService.sponsorAd(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error sponsoring product:', error);
    if (error.message === 'Product is already sponsored') {
      res.status(400).json({ error: 'Product is already sponsored' });
    } else {
      res.status(500).json({ error: 'Error sponsoring product' });
    }
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productService.deleteProduct(id);
    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};

module.exports = {
  listProducts,
  addProduct,
  updateProduct,
  getProductById,
  getProductsByUserId,
  sponsorAd,
  deleteProduct
};
