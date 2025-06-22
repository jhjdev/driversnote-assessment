import { mongoDBService } from '../services/mongodb.service';
import { User } from '../types/types';

export class UserService {
  private readonly COLLECTION_NAME = 'users';

  /**
   * Initialize the users collection with sample data if it's empty
   */
  async initializeUsers(): Promise<void> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);

      // Check if users collection is empty
      const count = await collection.countDocuments();
      if (count === 0) {
        // Insert sample users
        await collection.insertMany(SAMPLE_USERS);
        console.log('Sample users initialized in MongoDB');
      }
    } catch (error) {
      console.error('Error initializing users:', error);
      throw error;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);
      return await collection.find<User>({}).toArray();
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);
      return await collection.findOne<User>({ id });
    } catch (error) {
      console.error(`Error getting user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);

      // Get the next ID
      const maxIdDoc = await collection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      const nextId = maxIdDoc.length > 0 ? maxIdDoc[0].id + 1 : 1;

      const newUser: User = { ...user, id: nextId };
      await collection.insertOne(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);

      await collection.updateOne({ id }, { $set: userData });
      return this.getUserById(id);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<boolean> {
    try {
      await mongoDBService.connect();
      const collection = mongoDBService.collection(this.COLLECTION_NAME);

      const result = await collection.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
}

// Sample user data for initialization
const SAMPLE_USERS: User[] = [
  {
    id: 1,
    full_name: 'Karmen Fadel',
    address1: '546 Collin Vista',
    address2: null,
    postal_code: 90149,
    city: 'Quebec',
    country_name: 'Canada',
    country_id: 'ca',
    organisation_id: 1,
  },
  {
    id: 2,
    full_name: 'Lasonya Dietrich Sr.',
    address1: '37872 Jed Centers',
    address2: 'Apt. 517',
    postal_code: 36304,
    city: 'Kassandratown',
    country_name: 'Australia',
    country_id: 'au',
    organisation_id: 1,
  },
  {
    id: 3,
    full_name: 'Ada Stiedemann',
    address1: null,
    address2: null,
    postal_code: null,
    city: null,
    country_name: 'Denmark',
    country_id: 'dk',
    organisation_id: 2,
  },
  {
    id: 4,
    full_name: 'Miss Ji Denesik',
    address1: '540 Schmidt Trail',
    address2: null,
    postal_code: '62073-4317',
    city: 'Port Wilfordberg',
    country_name: 'USA',
    country_id: 'us',
    organisation_id: null,
  },
  {
    id: 5,
    full_name: 'Sherwood Sipes',
    address1: '967 Weissnat Expressway',
    address2: null,
    postal_code: '53073',
    city: 'New York',
    country_name: 'USA',
    country_id: 'us',
    organisation_id: 3,
  },
];

// Export singleton instance
export const userService = new UserService();
