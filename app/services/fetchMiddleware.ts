import { User } from '../types/types';
import { apiService } from './api.service';

export class FetchMiddleware {
  private readonly COLLECTION_NAME = 'users';

  /**
   * Initialize users collection if needed
   */
  async initializeUsers(): Promise<void> {
    try {
      console.log('Initializing users in API...');
      // Try to initialize with sample data if collection is empty
      await apiService.initializeUsers(SAMPLE_USERS);
    } catch (error) {
      console.warn(
        'Failed to initialize users, falling back to sample data:',
        error,
      );
    }
  }

  /**
   * Fetch all users from API
   */
  async fetchAllUsers(): Promise<User[]> {
    try {
      console.log('Fetching users from API...');
      const users = await apiService.getUsers();
      console.log('Successfully fetched', users.length, 'users from API');
      return users;
    } catch (error) {
      console.warn(
        'Failed to fetch users from API, using sample data:',
        error,
      );
      return SAMPLE_USERS;
    }
  }

  /**
   * Fetch a single user by ID
   */
  async fetchUserById(id: number): Promise<User | null> {
    try {
      console.log(`Fetching user ${id} from API...`);
      const user = await apiService.getUserById(id);
      if (user) {
        console.log('Successfully fetched user from API:', user.full_name);
        return user;
      } else {
        console.log(`User ${id} not found in API, checking sample data...`);
      }
    } catch (error) {
      console.warn(
        `Failed to fetch user ${id} from API, using sample data:`,
        error,
      );
    }

    // Fallback to sample data
    const sampleUser = SAMPLE_USERS.find(user => user.id === id);
    if (sampleUser) {
      console.log('Found user in sample data:', sampleUser.full_name);
      return sampleUser;
    } else {
      console.warn(`User ${id} not found in sample data either`);
      return null;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      console.log('Creating user in API...', userData);
      const newUser = await apiService.createUser(userData);
      console.log('Successfully created user in API:', newUser);
      return newUser;
    } catch (error) {
      console.warn('Failed to create user in API:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      console.log(`Updating user ${id} in API...`, userData);
      const updatedUser = await apiService.updateUser(id, userData);
      console.log('Successfully updated user in API:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.warn(`Failed to update user ${id} in API:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<boolean> {
    try {
      console.log(`Deleting user ${id} from API...`);
      const result = await apiService.deleteUser(id);
      console.log(`Successfully deleted user ${id} from API:`, result);
      return result.success;
    } catch (error) {
      console.warn(`Failed to delete user ${id} from API:`, error);
      throw error;
    }
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
