import { User } from '../types/types';
import { mongodbService } from './mongodb.service';

export class FetchMiddleware {
  private readonly COLLECTION_NAME = 'users';

  /**
   * Initialize users collection if needed
   */
  async initializeUsers(): Promise<void> {
    try {
      console.log('Initializing users in MongoDB...');
      // Try to initialize with sample data if collection is empty
      await mongodbService.initializeUsers(SAMPLE_USERS);
    } catch (error) {
      console.warn('Failed to initialize users, falling back to sample data:', error);
    }
  }

  /**
   * Fetch all users from MongoDB
   */
  async fetchAllUsers(): Promise<User[]> {
    try {
      console.log('Fetching users from MongoDB...');
      const users = await mongodbService.getUsers();
      console.log('Successfully fetched', users.length, 'users from MongoDB');
      return users;
    } catch (error) {
      console.warn('Failed to fetch users from MongoDB, using sample data:', error);
      return SAMPLE_USERS;
    }
  }

  /**
   * Fetch a single user by ID
   */
  async fetchUserById(id: number): Promise<User | null> {
    try {
      console.log(`Fetching user ${id} from MongoDB...`);
      const user = await mongodbService.getUserById(id);
      if (user) {
        console.log('Successfully fetched user from MongoDB:', user.full_name);
        return user;
      }
    } catch (error) {
      console.warn(`Failed to fetch user ${id} from MongoDB, using sample data:`, error);
    }
    
    // Fallback to sample data
    const user = SAMPLE_USERS.find(user => user.id === id);
    return user || null;
  }

  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    // For now, just create a new user with a generated ID
    const maxId = Math.max(...SAMPLE_USERS.map(u => u.id));
    const newUser: User = { ...userData, id: maxId + 1 };
    console.log('Created user (mock):', newUser);
    return newUser;
  }

  /**
   * Update an existing user
   */
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = SAMPLE_USERS.find(u => u.id === id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    const updatedUser: User = { ...existingUser, ...userData, id };
    console.log('Updated user (mock):', updatedUser);
    return updatedUser;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<boolean> {
    const userExists = SAMPLE_USERS.some(u => u.id === id);
    console.log(`Deleted user ${id} (mock):`, userExists);
    return userExists;
  }
}

// Sample user data for fallback
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

// Export a singleton instance
export const fetchMiddleware = new FetchMiddleware();
