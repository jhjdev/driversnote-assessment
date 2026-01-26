# Database Migration: PostgreSQL to Turso

## Current State

- **Database**: PostgreSQL
- **ORM**: None (raw SQL queries)
- **Hosting**: TBD

## Recommended Solution: Turso

For this lightweight API, **Turso (SQLite Edge)** is the perfect choice:

### Why Turso?

✅ **Serverless-native** - No connection pooling needed for Vercel/serverless deployments  
✅ **Edge-first** - Data replicated globally for <50ms reads anywhere  
✅ **Cost-effective** - Generous free tier: 9GB storage, 1B row reads/month  
✅ **Simple migration** - SQLite syntax is straightforward  
✅ **Type-safe** - Full TypeScript support with Drizzle ORM  
✅ **Zero cold starts** - No database connection overhead  
✅ **Local development = Production** - SQLite file for local dev, Turso for production

### Tech Stack

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client);
```

## Migration Plan

### Phase 1: Setup Turso (15 minutes)

```bash
# Install Turso CLI
brew install tursodatabase/tap/turso

# Authenticate
turso auth login

# Create database
turso db create driversnote-api

# Get connection details
turso db show driversnote-api --url
turso db tokens create driversnote-api

# Create .env file
echo "TURSO_DATABASE_URL=libsql://..." >> .env
echo "TURSO_AUTH_TOKEN=..." >> .env
```

### Phase 2: Install Dependencies (5 minutes)

```bash
cd api

# Install Turso client and Drizzle ORM
npm install @libsql/client drizzle-orm
npm install -D drizzle-kit
```

### Phase 3: Define Schema (30 minutes)

```typescript
// drizzle/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const trips = sqliteTable('trips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  distance: integer('distance'), // meters
  purpose: text('purpose'), // 'business', 'personal', 'commute'
  notes: text('notes'),
  startLocation: text('start_location'), // JSON string
  endLocation: text('end_location'), // JSON string
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

Create config:

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
```

### Phase 4: Generate & Push Schema (5 minutes)

```bash
# Generate migration
npx drizzle-kit generate:sqlite

# Push to Turso
npx drizzle-kit push:sqlite
```

### Phase 5: Migrate Data from PostgreSQL (1 hour)

```typescript
// scripts/migrate-to-turso.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { trips, users } from '../drizzle/schema';

async function migrate() {
  // Connect to PostgreSQL
  const pgPool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  // Connect to Turso
  const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  const db = drizzle(tursoClient);

  // Migrate users
  const pgUsers = await pgPool.query('SELECT * FROM users');
  for (const user of pgUsers.rows) {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date(user.created_at),
    });
  }
  console.log(`✅ Migrated ${pgUsers.rows.length} users`);

  // Migrate trips
  const pgTrips = await pgPool.query('SELECT * FROM trips');
  for (const trip of pgTrips.rows) {
    await db.insert(trips).values({
      userId: trip.user_id,
      startTime: new Date(trip.start_time),
      endTime: trip.end_time ? new Date(trip.end_time) : null,
      distance: trip.distance,
      purpose: trip.purpose,
      notes: trip.notes,
      startLocation: JSON.stringify(trip.start_location),
      endLocation: JSON.stringify(trip.end_location),
      createdAt: new Date(trip.created_at),
    });
  }
  console.log(`✅ Migrated ${pgTrips.rows.length} trips`);

  await pgPool.end();
  console.log('✅ Migration complete!');
}

migrate().catch(console.error);
```

Run migration:

```bash
npx tsx scripts/migrate-to-turso.ts
```

### Phase 6: Update API Code (2 hours)

Replace raw PostgreSQL queries with Drizzle:

**Before (PostgreSQL)**:

```typescript
const result = await pool.query('SELECT * FROM trips WHERE user_id = $1', [
  userId,
]);
const userTrips = result.rows;
```

**After (Drizzle + Turso)**:

```typescript
import { eq } from 'drizzle-orm';
import { db } from './db';
import { trips } from '../drizzle/schema';

const userTrips = await db.select().from(trips).where(eq(trips.userId, userId));
```

### Phase 7: Deploy (30 minutes)

Update environment variables in Vercel:

```bash
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

Deploy:

```bash
vercel --prod
```

## Cost Comparison

| Database                        | Monthly Cost (for this API) |
| ------------------------------- | --------------------------- |
| PostgreSQL (Supabase free tier) | $0 (500MB limit)            |
| PostgreSQL (Neon free tier)     | $0 (512MB limit)            |
| **Turso free tier**             | **$0 (9GB, 1B reads)**      |

Turso's free tier is **18x larger** than typical Postgres free tiers and perfect for this lightweight API.

## Local Development

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const isProduction = process.env.NODE_ENV === 'production';

const client = createClient({
  url: isProduction ? process.env.TURSO_DATABASE_URL! : 'file:./local.db', // SQLite file for local dev
  authToken: isProduction ? process.env.TURSO_AUTH_TOKEN : undefined,
});

export const db = drizzle(client);
```

Local development uses a SQLite file (`local.db`), production uses Turso - same code, zero config changes.

## Timeline

- ✅ **Phase 1**: Setup Turso (15 min)
- ✅ **Phase 2**: Install deps (5 min)
- ✅ **Phase 3**: Define schema (30 min)
- ✅ **Phase 4**: Push schema (5 min)
- ✅ **Phase 5**: Migrate data (1 hour)
- ✅ **Phase 6**: Update code (2 hours)
- ✅ **Phase 7**: Deploy (30 min)

**Total: ~4.5 hours**

## Next Steps

1. Create Turso account and database
2. Install dependencies
3. Define schema based on current PostgreSQL tables
4. Run migration script
5. Update API routes to use Drizzle queries
6. Deploy to Vercel

The lightweight nature of this API makes it a perfect candidate for Turso's edge database approach.
