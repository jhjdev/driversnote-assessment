import { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import authPlugin from '../../src/plugins/auth';
import usersRoutes from '../../src/routes/users';
import receiptsRoutes from '../../src/routes/receipts';
import { initializeDb, closeDb } from '../../src/utils/db';

export async function buildTestApp(): Promise<FastifyInstance> {
  if (!process.env.API_KEY) {
    process.env.API_KEY = 'test-api-key-12345';
  }

  // Fresh in-memory DB per test
  await closeDb();
  await initializeDb();

  const fastify = Fastify({
    logger: false,
  });

  await fastify.register(authPlugin);
  await fastify.register(usersRoutes, { prefix: '/api' });
  await fastify.register(receiptsRoutes, { prefix: '/api' });

  fastify.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'test',
    version: '1.0.0',
  }));

  return fastify;
}

export function getAuthHeaders(): Record<string, string> {
  return {
    'X-API-Key': process.env.API_KEY || 'test-api-key-12345',
  };
}

export async function closeTestApp(app: FastifyInstance): Promise<void> {
  await app.close();
  await closeDb();
}
