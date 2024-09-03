const jwt = require('jsonwebtoken');
const mongodbConnection = require('../utils/helperFunctions/mongodbConnection');
const { encrypt, decrypt } = require('../utils/helperFunctions/encrypt_decrypt');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

async function registerUser(userData) {
  const usersCollection = await mongodbConnection("user");
  
  const existingUser = await usersCollection.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Email is already in use');
  }

  // Encrypting the password before storing
  const { iv, encryptedData } = encrypt(userData.password);

  const lastUser = await usersCollection.find({}).sort({ _id: -1 }).limit(1).toArray();
  const newId = lastUser.length > 0 ? parseInt(lastUser[0]._id) + 1 : 1;

  const newUser = {
    ...userData,
    _id: newId,
    description: null,
    password: { iv, encryptedData },
    profilePic: null,
    likedProd: [],
    myProd: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    chat: [],
  };

  try {
    const result = await usersCollection.insertOne(newUser);
    console.log('Insertion result:', result);

    if (result.insertedId) {
      return {
        id: newId,
        ...newUser,
        token: jwt.sign({ id: newId, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' })
      };
    } else {
      throw new Error('Failed to register user');
    }
  } catch (error) {
    console.error('Error during user insertion:', error);
    throw new Error('Failed to register user');
  }
}

async function loginUser(email, password) {
  const usersCollection = await mongodbConnection("user");
  const user = await usersCollection.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Decrypting the stored password and compare with the provided password
  let decryptedPassword = decrypt(user.password);
  if (password !== decryptedPassword) {
    throw new Error('Invalid email or password');
  }

  // Generating JWT
  const token = jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, userId: user._id };
}

async function getUserById(id) {
  const usersCollection = await mongodbConnection("user");
  const user = await usersCollection.findOne({ _id: id }); // id is numeric
  if (!user) {
    throw new Error('User not found');
  }
  if (user) {
    user.profilePic = `${user.profilePic}`;
  }
  if (user.password && user.password.iv && user.password.encryptedData) {
    user.password = decrypt(user.password);
  } else {
    user.password = null;
  }
  return user;
}

async function updateUser(id, updatedData) {
  const usersCollection = await mongodbConnection("user");
  if (updatedData.password) {
    // Encrypting the password before updating
    const { iv, encryptedData } = encrypt(updatedData.password);
    updatedData.password = { iv, encryptedData };
  }

  if (updatedData.profilePic && updatedData.profilePic !== 'null') {
    updatedData.profilePic = `${updatedData.profilePic}`;
  }
  const update = {
    $set: {
      ...updatedData,
      updatedAt: new Date(),
    },
  };

  const result = await usersCollection.updateOne({ _id: id }, update);
  if (result.matchedCount === 0) {
    throw new Error('User not found');
  }
  return result;
}

async function deleteUser(id) {
  const usersCollection = await mongodbConnection("user");
  const result = await usersCollection.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    throw new Error('User not found');
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
};
