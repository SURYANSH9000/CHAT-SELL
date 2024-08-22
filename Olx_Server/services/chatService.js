const mongodbConnection = require('../utils/helperFunctions/mongodbConnection');
const { ObjectId } = require('mongodb');

async function getChatsByUserId(userId) {
  const chatsCollection = await mongodbConnection("chats");
  const userIdToQuery = String(userId);

  // Fetch all chats where the user is a participant
  const chats = await chatsCollection.find({
    participants: userIdToQuery
  }).toArray();

  chats.reverse();

  const productsCollection = await mongodbConnection("products");
  
  // Attach product details to each chat
  for (let chat of chats) {
    if (chat.product_id) {
      chat.product = await productsCollection.findOne({ _id: new ObjectId(chat.product_id) });
    }
  }
  console.log('Chats for the user are:', chats);
  return chats;
}

async function sendMessage(chatId, message) {
  try {
    const chatCollection = await mongodbConnection("chats");
    const objectId = new ObjectId(chatId);

    // Fetch the chat to check its current state
    const chat = await chatCollection.findOne({ _id: objectId });

    // If the chat exists and the messages field is not an array, convert it to an array
    if (chat && !Array.isArray(chat.messages)) {
      console.log('Converting messages to array format');
      await chatCollection.updateOne(
        { _id: objectId },
        { $set: { messages: [chat.messages] } }
      );
    }

    // Push the new message into the messages array
    const updateResult = await chatCollection.updateOne(
      { _id: objectId },
      { $push: { messages: message } }
    );

    console.log('Update result:', updateResult);

    if (updateResult.matchedCount === 0) {
      throw new Error('No chat found with the given chatId');
    }

    if (updateResult.modifiedCount > 0) {
      const updatedChat = await chatCollection.findOne({ _id: objectId });
      console.log('Message successfully added to chat:', updatedChat);
      return { success: true, chat: updatedChat };
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, message: error.message };
  }
}


async function createChat(newChat) {
  const chatsCollection = await mongodbConnection("chats");
  newChat.createdAt = new Date();
  const result = await chatsCollection.insertOne(newChat);
  if (result.acknowledged) {
    const createdChat = await chatsCollection.findOne({ _id: result.insertedId });
    console.log('Created chat:', createdChat);
    return createdChat;
  } else {
    throw new Error('Chat creation failed');
  }
}

async function getChatByParticipants(participants) {
  const chatsCollection = await mongodbConnection("chats");
  const existingChat = await chatsCollection.findOne({
    participants: { $all: participants },
  });
  return existingChat;
}

module.exports = {
  getChatsByUserId,
  sendMessage,
  createChat,
  getChatByParticipants
};
