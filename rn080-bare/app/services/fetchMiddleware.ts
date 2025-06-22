import { mongoDBService } from './mongodb.service';
import { User } from '../types/types';

export class FetchMiddleware {
  private readonly COLLECTION_NAME = 'users';

  /**
   * Initialize users collection if needed
   */
  async initializeUsers(): Promise<void> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);
      const count = await collection.count({});
      // If no users exist, we could initialize with default data
      // This is similar to what was in UserContext
      if (count === 0) {
        console.log('No users found, initializing collection...');
        // Add initialization logic here if needed
      }
    } catch (error) {
      console.error('Error initializing users collection:', error);
      throw error;
    }
  }

  /**
   * Fetch all users from the database
   */
  async fetchAllUsers(): Promise<User[]> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);
      return await collection.find<User>({}).toArray();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Fetch a single user by ID
   */
  async fetchUserById(id: number): Promise<User | null> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);
      return await collection.findOne<User>({ id });
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const fetchMiddleware = new FetchMiddleware();
