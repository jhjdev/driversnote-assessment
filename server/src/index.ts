import express, { Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';
import cors from 'cors';
import * as dotenv from 'dotenv';

// Load environment variables from parent directory
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db: Db;
let client: MongoClient;

interface User {
  id: number;
  full_name: string;
  tag: string;
  // Add other user properties as needed
}

interface CreateUserRequest {
  full_name: string;
  tag: string;
  // Add other properties as needed
}

interface Receipt {
  id: string;
  userId: number;
  userName: string;
  beaconQuantity: number;
  discount: number;
  deliveryAddress: string;
  totalPrice: number;
  timestamp: string;
  // Add other receipt properties as needed
}

interface CreateReceiptRequest {
  userId: number;
  userName: string;
  beaconQuantity: number;
  discount: number;
  deliveryAddress: string;
  totalPrice: number;
}

interface InitializeUsersRequest {
  users: User[];
}

interface InitializeUsersResponse {
  success: boolean;
  message: string;
  error?: string;
}

async function connectToMongoDB(): Promise<Db> {
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
app.get('/api/users', async(req: Request, res: Response) => {
  try {
    const users = await db.collection<User>('users').find({}).toArray();
    console.log(`📋 Fetched ${users.length} users from MongoDB`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get(
  '/api/users/:id',
  async(req: Request, res: Response): Promise<Response> => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await db.collection<User>('users').findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log(`👤 Fetched user: ${user.full_name}`);
      return res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  },
);

app.post(
  '/api/users',
  async(req: Request<{}, User, CreateUserRequest>, res: Response) => {
    try {
      const userData = req.body;

      // Generate new ID
      const maxUser = await db
        .collection<User>('users')
        .findOne({}, { sort: { id: -1 } });
      const newUser: User = {
        ...userData,
        id: (maxUser?.id || 0) + 1,
      };

      await db.collection<User>('users').insertOne(newUser);
      console.log(`➕ Created new user: ${newUser.full_name}`);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  },
);

app.put(
  '/api/users/:id',
  async(req: Request, res: Response): Promise<Response> => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const userData: Partial<User> = req.body;

      const result = await db
        .collection<User>('users')
        .updateOne({ id: userId }, { $set: userData });

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await db
        .collection<User>('users')
        .findOne({ id: userId });
      console.log(`✏️ Updated user: ${updatedUser?.full_name}`);
      return res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  },
);

app.delete(
  '/api/users/:id',
  async(req: Request, res: Response): Promise<Response> => {
    try {
      const userIdParam = req.params.id;
      if (!userIdParam) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const userId = parseInt(userIdParam);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const result = await db
        .collection<User>('users')
        .deleteOne({ id: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log(`🗑️ Deleted user with ID: ${userId}`);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  },
);

app.post(
  '/api/users/initialize',
  async(
    req: Request<{}, InitializeUsersResponse, InitializeUsersRequest>,
    res: Response<InitializeUsersResponse>,
  ) => {
    try {
      const { users } = req.body;

      // Check if users collection is empty
      const existingCount = await db.collection('users').countDocuments();

      if (existingCount === 0) {
        await db.collection<User>('users').insertMany(users);
        console.log(`🚀 Initialized ${users.length} users in MongoDB`);
        res.json({
          success: true,
          message: `Initialized ${users.length} users`,
        });
      } else {
        console.log(
          `📊 Users collection already has ${existingCount} documents`,
        );
        res.json({
          success: true,
          message: `Collection already has ${existingCount} users`,
        });
      }
    } catch (error) {
      console.error('Error initializing users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize users',
        error: 'Failed to initialize users',
      });
    }
  },
);

// Receipt Routes
app.get('/api/receipts', async(req: Request, res: Response) => {
  try {
    const receipts = await db
      .collection<Receipt>('receipts')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    console.log(`📋 Fetched ${receipts.length} receipts from MongoDB`);
    res.json(receipts);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

app.post(
  '/api/receipts',
  async(req: Request<{}, Receipt, CreateReceiptRequest>, res: Response) => {
    try {
      const receiptData = req.body;

      const newReceipt: Receipt = {
        ...receiptData,
        id: new Date().getTime().toString(), // Simple ID generation
        timestamp: new Date().toISOString(),
      };

      await db.collection<Receipt>('receipts').insertOne(newReceipt);
      console.log(`🧾 Created new receipt for user: ${newReceipt.userName}`);
      res.status(201).json(newReceipt);
    } catch (error) {
      console.error('Error creating receipt:', error);
      res.status(500).json({ error: 'Failed to create receipt' });
    }
  },
);

app.delete(
  '/api/receipts/:id',
  async(req: Request, res: Response): Promise<Response> => {
    try {
      const receiptIdParam = req.params.id;
      if (!receiptIdParam) {
        return res.status(400).json({ error: 'Receipt ID is required' });
      }

      const result = await db
        .collection<Receipt>('receipts')
        .deleteOne({ id: receiptIdParam });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Receipt not found' });
      }

      console.log(`🗑️ Deleted receipt with ID: ${receiptIdParam}`);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting receipt:', error);
      return res.status(500).json({ error: 'Failed to delete receipt' });
    }
  },
);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected',
  });
});

// Start server
async function startServer(): Promise<void> {
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
process.on('SIGINT', async() => {
  console.log('\n🔄 Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

startServer().catch(console.error);
