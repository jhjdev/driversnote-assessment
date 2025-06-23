const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
let client;

async function connectToMongoDB() {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || 'driversnote';

    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);

    console.log(`✅ Connected to MongoDB database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// API Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.collection('users').find({}).toArray();
    console.log(`📋 Fetched ${users.length} users from MongoDB`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await db.collection('users').findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`👤 Fetched user: ${user.full_name}`);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;

    // Generate new ID
    const maxUser = await db
      .collection('users')
      .findOne({}, { sort: { id: -1 } });
    userData.id = (maxUser?.id || 0) + 1;

    const result = await db.collection('users').insertOne(userData);
    console.log(`➕ Created new user: ${userData.full_name}`);
    res.status(201).json(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userData = req.body;

    const result = await db
      .collection('users')
      .updateOne({ id: userId }, { $set: userData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await db.collection('users').findOne({ id: userId });
    console.log(`✏️ Updated user: ${updatedUser.full_name}`);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const result = await db.collection('users').deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`🗑️ Deleted user with ID: ${userId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.post('/api/users/initialize', async (req, res) => {
  try {
    const { users } = req.body;

    // Check if users collection is empty
    const existingCount = await db.collection('users').countDocuments();

    if (existingCount === 0) {
      await db.collection('users').insertMany(users);
      console.log(`🚀 Initialized ${users.length} users in MongoDB`);
      res.json({ success: true, message: `Initialized ${users.length} users` });
    } else {
      console.log(`📊 Users collection already has ${existingCount} documents`);
      res.json({
        success: true,
        message: `Collection already has ${existingCount} users`,
      });
    }
  } catch (error) {
    console.error('Error initializing users:', error);
    res.status(500).json({ error: 'Failed to initialize users' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected',
  });
});

// Start server
async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

startServer();
