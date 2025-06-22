import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI, MONGODB_DB_NAME } from '@env';

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<void> {
    try {
      if (!this.client) {
        this.client = new MongoClient(MONGODB_URI);
        await this.client.connect();
        this.db = this.client.db(MONGODB_DB_NAME);
        console.log('Connected to MongoDB successfully');
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Get database instance
   */
  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Close MongoDB connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('MongoDB connection closed');
    }
  }

  /**
   * Get collection
   * @param collectionName Name of the collection
   */
  collection(collectionName: string) {
    return this.getDb().collection(collectionName);
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBService();
