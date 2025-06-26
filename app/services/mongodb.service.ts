import { MONGODB_URI, MONGODB_DB_NAME } from '@env';
import { User, Receipt } from '../types/types';

// MongoDB Data API service for hosted database access
class MongoDBService {
  private apiEndpoint: string;
  private appId: string;
  private dataSource: string;
  private database: string;
  private apiKey: string;

  constructor() {
    // Parse MongoDB connection for Data API
    const uri = MONGODB_URI || '';
    const dbName = MONGODB_DB_NAME || 'driversnote';

    // Extract cluster info from URI
    const clusterMatch = uri.match(/@([^.]+)/);
    const clusterName = clusterMatch ? clusterMatch[1] : 'driversnote';

    // MongoDB Data API configuration
    // For now, we'll use a simple HTTP API approach
    this.appId = 'data-endpoint';
    this.apiEndpoint = 'http://localhost:4000/api'; // Your backend API
    this.dataSource = clusterName;
    this.database = dbName;
    this.apiKey = '';

    console.log('MongoDB Service initialized with:', {
      database: this.database,
      dataSource: this.dataSource,
      endpoint: this.apiEndpoint,
      hasUri: !!MONGODB_URI,
    });
  }

  /**
   * Make HTTP request to backend API with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options?: RequestInit,
    retries = 3,
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(
          `Making request to: ${this.apiEndpoint}${endpoint} (attempt ${attempt}/${retries})`,
        );
        const response = await fetch(`${this.apiEndpoint}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error(
          `API request error (attempt ${attempt}/${retries}):`,
          error,
        );

        if (attempt === retries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 100;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('All retry attempts failed');
  }

  /**
   * Get all users from MongoDB
   */
  async getUsers(): Promise<User[]> {
    return this.makeRequest<User[]>('/users');
  }

  /**
   * Get single user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    try {
      return await this.makeRequest<User>(`/users/${id}`);
    } catch (error) {
      console.warn(`User ${id} not found:`, error);
      return null;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return this.makeRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Update user
   */
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return this.makeRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Initialize users collection if needed
   */
  async initializeUsers(users: User[]): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>('/users/initialize', {
      method: 'POST',
      body: JSON.stringify({ users }),
    });
  }

  /**
   * Get all receipts from MongoDB
   */
  async getReceipts(): Promise<Receipt[]> {
    return this.makeRequest<Receipt[]>('/receipts');
  }

  /**
   * Create new receipt
   */
  async createReceipt(receiptData: Omit<Receipt, 'id' | 'timestamp'>): Promise<Receipt> {
    return this.makeRequest<Receipt>('/receipts', {
      method: 'POST',
      body: JSON.stringify(receiptData),
    });
  }

  /**
   * Delete receipt
   */
  async deleteReceipt(id: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(`/receipts/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const mongodbService = new MongoDBService();
