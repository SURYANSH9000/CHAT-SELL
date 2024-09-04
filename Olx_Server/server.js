const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dotenv = require("dotenv");
const mongodbConnection = require('./utils/helperFunctions/mongodbConnection');
const authMiddleware = require('./middlewares/authMiddleware');

const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const chatController = require('./controllers/chatController');
const wishlistController = require('./controllers/wishlistController');
const chatService = require('./services/chatService');

const upload = require('./middlewares/uploadMiddleware');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const port = process.env.PORT || 3000;

app.use('/assets', express.static(path.join(__dirname, '../Olx_Client/src/assets')));

// File upload routes
app.post('/uploadProfilePic', upload.single('profilePic'), (req, res) => {
  if (req.file) {
    const filePath = req.file.path; // Cloudinary file URL
    res.json({ filePath });
  } else {
    res.status(400).send('No file uploaded.');
  }
});

// User routes
app.post("/register", userController.registerUser);
app.post("/login", userController.loginUser);
app.get("/user/:id", userController.getUserById);
app.put("/user/:id",authMiddleware, upload.single('profilePic'), userController.updateUser);

// Product routes
app.get('/products', productController.listProducts);
app.post('/products/add',authMiddleware, upload.array('images', 3), productController.addProduct);
app.put('/products/:id',authMiddleware, upload.array('images', 3), productController.updateProduct);
app.get('/products/:id', productController.getProductById);
app.get('/products/user/:userId',authMiddleware, productController.getProductsByUserId);
app.put('/products/:id/sponsor',authMiddleware, productController.sponsorAd);
app.delete('/products/:id',authMiddleware, productController.deleteProduct);

// Wishlist routes
app.post('/wishlist/add',authMiddleware, wishlistController.addToWishlist);
app.get('/wishlist/:userId',authMiddleware, wishlistController.getWishlistByUserId);
app.delete('/wishlist/:userId/:productId',authMiddleware, wishlistController.removeFromWishlist);

// Chat routes
app.get("/chats/user/:userId",authMiddleware, chatController.getChatsByUserId);
app.put("/chats/:chatId/messages",authMiddleware, chatController.sendMessage);
app.post("/chats",authMiddleware, chatController.createChat);
app.post('/chats/participants',authMiddleware, chatController.getChatByParticipants);

const server = http.createServer(app);

const io = new Server(server, {
  // cors: {
  //   origin: '*',
  // },
  // methods: ["GET", "POST"]
  cors: {
    origin: "https://chatandsell.netlify.app", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// Attaching Socket.io to Express req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('User connected here:', socket.id);

  // Handle joining a chat room
  socket.on('joinChat', ({ chatId, userId }) => {
    console.log(`User ${userId} is joining chat ${chatId}`);
    socket.join(chatId);
  });

  socket.on('sendMessage', async ({ roomId, chatId, message }) => {
    console.log("Received sendMessage event with:", { roomId, chatId, message });
    try {
      const response = await chatService.sendMessage(chatId, message);
      if (response.success) {
        console.log("Broadcasting message to room:", roomId);
        io.to(roomId).emit('receiveMessage', {
          chatId: chatId,
          message: message
        });
      } else {
        console.error('Failed to send message via socket:', response.message);
      }
    } catch (error) {
      console.error('Error in sendMessage event:', error);
    }
  });
  
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
