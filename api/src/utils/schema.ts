import { Client } from '@libsql/client';

export async function initializeSchema(client: Client): Promise<void> {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      tag TEXT,
      address1 TEXT,
      address2 TEXT,
      postal_code TEXT,
      city TEXT,
      country_name TEXT,
      country_id TEXT,
      organisation_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      beacon_quantity INTEGER NOT NULL,
      discount REAL NOT NULL,
      delivery_address TEXT NOT NULL,
      total_price REAL NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);
}
