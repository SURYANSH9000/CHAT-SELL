const { ObjectId } = require('mongodb');
const mongodbConnection = require('../utils/helperFunctions/mongodbConnection');
const cron = require('node-cron');

// Schedule a cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  const productsCollection = await mongodbConnection("products");
  console.log('Running cron job to update expired products...');
  const currentDate = new Date();
  
  // Subtract 5 days from the current date to determine the expiration threshold
  const expirationThreshold = new Date();
  expirationThreshold.setDate(currentDate.getDate() - 30);

  console.log('Current Date:', currentDate);
  console.log('Expiration Threshold Date:', expirationThreshold);

  // Update products where the createdAt date is older than the expiration threshold and isFeatured is true
  const result = await productsCollection.updateMany(
    { createdAt: { $lte: expirationThreshold }, isFeatured: true },
    { $set: { isFeatured: false } }
  );

  console.log(`Expired products updated: ${result.modifiedCount} products were updated.`);
});

async function listProducts({ page, limit, excludeUserId, searchQuery, locationQuery }) {
  const productsCollection = await mongodbConnection("products");
  const query = {
    isFeatured: true, // Only include non-expired products
    ...(excludeUserId && { sellerId: { $ne: excludeUserId } })
  };
  
  if (searchQuery) {
    query.$or = [
      { category: { $regex: searchQuery, $options: 'i' } },
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ];
  }

  if (locationQuery) {
    query.address = { $regex: locationQuery, $options: 'i' }; 
  }

  const products = await productsCollection
    .find(query)
    .sort({ isSponsored: -1, createdAt: -1 }) 
    .skip((page - 1) * limit) 
    .limit(limit) 
    .toArray();
  console.log('Products:', products);
  return products;
}

async function addProduct(productData, imageFiles) {
  const productsCollection = await mongodbConnection("products");

  // Processing images
  const images = imageFiles ? imageFiles.map(file => file.filename) : [];

  const newProduct = {
    ...productData,
    images,
    isFeatured: true,
    isSponsored: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerId: productData.sellerId // Use sellerId directly from productData
  };

  console.log('Inserting new product:', newProduct);

  try {
    const result = await productsCollection.insertOne(newProduct);
    console.log('Insert result:', result);
    if (!result.acknowledged || !result.insertedId) {
      throw new Error('Product insertion failed');
    }
    const insertedProduct = await productsCollection.findOne({ _id: result.insertedId });
    return insertedProduct;
  } catch (error) {
    console.error('Error inserting product:', error);
    throw new Error('Error inserting product');
  }
}

async function getProductById(id) {
  const productsCollection = await mongodbConnection("products");
  id = new ObjectId(id);
  console.log('ID:', id);
  const product = await productsCollection.findOne({ _id: id, isFeatured: true });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
}

async function getProductsByUserId(id) {
  const productsCollection = await mongodbConnection("products");
  const products = await productsCollection.find({ sellerId: id }).toArray();
  if (!products) {
    throw new Error('Products not found');
  }
  return products;
}

async function updateProduct(id, productData, imageFiles) {
  const productsCollection = await mongodbConnection("products");
  id = new ObjectId(id);

  const product = await productsCollection.findOne({ _id: id });
  if (!product || !product.isFeatured) {
    throw new Error('Product not found or is not featured');
  }

  const images = imageFiles ? imageFiles.map(file => file.filename) : [];
  
  const updatedProductData = {
    ...productData,
    ...(images.length && { images }),
    updatedAt: new Date()
  };

  console.log('Updating product:', updatedProductData);

  try {
    const result = await productsCollection.updateOne(
      { _id: id },
      { $set: updatedProductData }
    );
    console.log('Update result:', result);
    if (result.matchedCount === 0) {
      throw new Error('Product not found');
    }
    const updatedProduct = await productsCollection.findOne({ _id: id });
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Error updating product');
  }
}

async function sponsorAd(id) {
  const productsCollection = await mongodbConnection("products");
  id = new ObjectId(id);

  const existingProduct = await productsCollection.findOne({ _id: id });
  if (!existingProduct || !existingProduct.isFeatured) {
    throw new Error('Product not found or is not featured');
  }

  if (existingProduct.isSponsored) {
    throw new Error('Product is already sponsored');
  }

  const updatedProductData = {
    isSponsored: true,
    updatedAt: new Date()
  };

  try {
    const result = await productsCollection.updateOne(
      { _id: id },
      { $set: updatedProductData }
    );
    if (result.matchedCount === 0) {
      throw new Error('Product not found');
    }
    const updatedProduct = await productsCollection.findOne({ _id: id });
    return updatedProduct;
  } catch (error) {
    console.error('Error sponsoring product:', error);
    throw new Error('Error sponsoring product');
  }
}

async function deleteProduct(id) {
  const productsCollection = await mongodbConnection("products");
  id = new ObjectId(id);

  const product = await productsCollection.findOne({ _id: id });
  if (!product || !product.isFeatured) {
    throw new Error('Product not found or is not featured');
  }

  const result = await productsCollection.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

module.exports = {
  listProducts,
  addProduct,
  updateProduct,
  getProductById,
  getProductsByUserId,
  sponsorAd,
  deleteProduct
};
