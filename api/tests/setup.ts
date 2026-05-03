import * as dotenv from 'dotenv';

// Load test environment variables (ok if .env.test is absent)
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || ':memory:';
process.env.API_KEY = process.env.API_KEY || 'test-api-key-12345';
process.env.PORT = process.env.PORT || '0';

// Mock console.log in tests to reduce noise
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: console.error,
  };
}
