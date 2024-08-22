const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://suryanshg:frY4aPpLYzpbB6Hp@olxclone.o43necw.mongodb.net/?retryWrites=true&w=majority&appName=OlxClone"

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