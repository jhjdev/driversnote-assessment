import { API_BASE_URL, API_KEY } from '@env';
import { User, Receipt } from '../types/types';

// API service for hosted database access
class MongoDBService {
  private apiEndpoint: string;
  private apiKey: string;

  constructor() {
    // Use the hosted API endpoint
    this.apiEndpoint = API_BASE_URL || 'https://driversnote-assessment-api.onrender.com/api';
    this.apiKey = API_KEY || '';

    console.log('MongoDB Service initialized with:', {
      endpoint: this.apiEndpoint,
      hasApiKey: !!this.apiKey,
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
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...options?.headers,
        };

        // Only add API key header if we have one
        if (this.apiKey) {
          headers['X-API-Key'] = this.apiKey;
        }

        console.log('Request headers:', {
          hasApiKey: !!headers['X-API-Key'],
          apiKeyPreview: headers['X-API-Key'] ? headers['X-API-Key'].substring(0, 10) + '...' : 'none',
          contentType: headers['Content-Type'],
        });

        const response = await fetch(`${this.apiEndpoint}${endpoint}`, {
          headers,
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
