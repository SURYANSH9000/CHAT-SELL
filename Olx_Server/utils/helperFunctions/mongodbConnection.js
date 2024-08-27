const { MongoClient } = require("mongodb");
require('dotenv').config();
const mongoUrl = process.env.MONGO_URI;
console.log("mongoUrl: " + mongoUrl);
const uri = mongoUrl;

let client;

async function mongodbConnection(collectionName) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
  }
  
  const db = client.db("OLX_Clone");
  console.log("Connected to databse: Olx_Clone");
  const collection = db.collection(collectionName);
  console.log("Connected to collection: " + collectionName);
  return collection;
}

module.exports = mongodbConnection;