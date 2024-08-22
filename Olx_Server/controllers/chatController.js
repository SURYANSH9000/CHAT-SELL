const chatService = require('../services/chatService');

async function getChatsByUserId(req, res) {
  try {
    const userId = req.params.userId;
    console.log('User ID:', userId);
    const chats = await chatService.getChatsByUserId(userId);
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats by user ID:', error);
    res.status(500).send("Internal server error");
  }
}

async function sendMessage(req, res) {
  const { chatId, message, roomId } = req.body;
  const io = req.io || res.io;

  try {
    console.log('Message is handled via socket, not through HTTP.');
    
    if (io && roomId) {
      console.log('Sending message to room:', roomId);
      io.to(roomId).emit('receiveMessage', { chatId, message });  // Send the event to Socket.IO clients
    }

    return res.status(200).send({ message: 'Message sent to socket', chatId });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).send({ message: 'Failed to send message', error: error.message });
  }
}


async function createChat(req, res) {
  console.log('Request body:', req.body);
  try {
    console.log('Request body:', req.body);
    const { participants,messages} = req.body;
    const newChat = {
      participants,
      messages: messages,
      createdAt: new Date()
    };
    console.log('New chat:', newChat);
    const createdChat = await chatService.createChat(newChat);
    res.status(201).json(createdChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).send("Internal server error");
  }
}


async function getChatByParticipants(req, res) {
  try {
    const { participants, messages } = req.body;  
    console.log('Participantssss:', participants);
    console.log('Message:', messages);
    const chat = await chatService.getChatByParticipants(participants);
    console.log('Chat:', chat);
    if (chat) {
      res.status(200).json(chat);
    } else {
      const createdChat = await chatService.createChat({ participants, messages });
      res.status(201).json(createdChat);
    }
  } catch (error) {
    console.error('Error fetching chat by participants:', error);
    res.status(500).send("Internal server error");
  }
}


module.exports = {
  getChatsByUserId,
  sendMessage,
  createChat,
  getChatByParticipants
};

