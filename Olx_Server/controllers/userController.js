const userService = require('../services/userService');

async function registerUser(req, res) {
  try {
    const userData = req.body;
    console.log('Registering user with data:', userData);
    const result = await userService.registerUser(userData);
    console.log('Registration result:', result);
    res.status(201).json(result);
  } catch (error) {
    console.error(`Error registering user: ${error}`);
    // Check for specific error messages
    if (error.message === 'Email is already in use') {
      res.status(400).json({ message: error.message }); // Send 400 Bad Request for validation errors
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}


async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log('Logging in user with:', req.body);
    const result = await userService.loginUser(email, password);
    console.log('Login result:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error logging in: ${error}`);
    res.status(401).send("Unauthorized");
  }
}

async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id); // id is numeric

    console.log('Fetching user with ID:', id);
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log('Fetching user with ID:', id);
    console.log('User:', user);
      delete user.password;
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
}


async function updateUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    if (req.file) {
      updatedData.profilePic = req.file.filename;
    }
    console.log('Updating user with ID:', id, 'and data:', updatedData);
    const result = await userService.updateUser(id, updatedData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
}

async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    console.log('Deleting user with ID:', id);
    await userService.deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
};
