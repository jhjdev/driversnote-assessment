import { createClient, Client } from '@libsql/client';
import { initializeSchema } from './schema';

let client: Client | null = null;

export interface DbConfig {
  url: string;
  authToken?: string;
}

export function getClient(): Client {
  if (client) {
    return client;
  }

  const url = process.env['TURSO_DATABASE_URL'];
  const authToken = process.env['TURSO_AUTH_TOKEN'];

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is required');
  }

  client = createClient({
    url,
    authToken,
  });

  return client;
}

export async function initializeDb(): Promise<Client> {
  const db = getClient();
  await initializeSchema(db);
  console.log('✅ Connected to Turso database');
  return db;
}

export function isConnected(): boolean {
  return client !== null;
}

export async function closeDb(): Promise<void> {
  if (client) {
    client.close();
    client = null;
  }
}
