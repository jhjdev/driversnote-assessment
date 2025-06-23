const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
const USERS_JSON_PATH = path.join(__dirname, 'app', 'data', 'users.json');

const uploadUsers = async () => {
  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection('users');

    // Read and parse users.json
    const usersData = JSON.parse(fs.readFileSync(USERS_JSON_PATH, 'utf-8'));

    // Check if collection is empty
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log('Users collection already contains data. Skipping upload.');
      return;
    }

    // Insert data into MongoDB
    await collection.insertMany(usersData);
    console.log('Users data uploaded successfully');
  } catch (error) {
    console.error('Error uploading users data:', error);
  } finally {
    // Close MongoDB connection
    await client.close();
    console.log('MongoDB connection closed');
  }
};

uploadUsers();