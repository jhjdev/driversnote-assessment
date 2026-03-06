import Fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import * as dotenv from 'dotenv';
import { initializeDb, isConnected, closeDb } from './utils/db';
import authPlugin from './plugins/auth';
import usersRoutes from './routes/users';
import receiptsRoutes from './routes/receipts';
import { HealthCheckResponse } from './types';
import type { IncomingMessage, ServerResponse } from 'http';

// Load environment variables
dotenv.config();

// Environment configuration
const config = {
  port: parseInt(process.env['PORT'] || '4000'),
  host: process.env['HOST'] || '0.0.0.0',
  corsOrigin: process.env['CORS_ORIGIN'] || '*',
  rateLimitMax: parseInt(process.env['RATE_LIMIT_MAX'] || '100'),
  rateLimitWindow: parseInt(process.env['RATE_LIMIT_WINDOW'] || '900000'),
};

async function buildApp(): Promise<FastifyInstance> {
  const fastify: FastifyInstance = Fastify({
    logger: {
      level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug'
    }
  });

  // Initialize Turso database and schema
  await initializeDb();

  // Register security plugins
  await fastify.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });

  // Register CORS
  await fastify.register(import('@fastify/cors'), {
    origin: config.corsOrigin,
    credentials: true,
  });

  // Register rate limiting
  await fastify.register(import('@fastify/rate-limit'), {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindow,
    skipOnError: false,
    ban: process.env['NODE_ENV'] === 'production' ? 10 : undefined,
    keyGenerator: (request) => {
      const forwarded = request.headers['x-forwarded-for'] as string;
      const realIP = request.headers['x-real-ip'] as string;
      if (forwarded) return forwarded.split(',')[0].trim();
      if (realIP) return realIP;
      return request.socket.remoteAddress || 'unknown';
    },
    errorResponseBuilder: (_request, context) => ({
      error: 'Rate limit exceeded',
      message: `Too many requests. Limit: ${context.max} per ${Math.round(context.ttl / 1000)} seconds`,
      retryAfter: Math.round(context.ttl / 1000),
    }),
  });

  // Determine Swagger host dynamically
  const vercelUrl = process.env['VERCEL_URL'];
  const swaggerHost = vercelUrl || `localhost:${config.port}`;
  const swaggerSchemes = vercelUrl ? ['https'] : ['http', 'https'];

  // Register Swagger
  await fastify.register(import('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Driversnote Assessment API',
        description: 'API service for Driversnote assessment with Turso database',
        version: '1.0.0',
      },
      host: swaggerHost,
      schemes: swaggerSchemes,
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'X-API-Key',
          in: 'header',
        },
      },
      security: [{ apiKey: [] }],
    },
  });

  // Register Swagger UI
  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });

  // Register authentication plugin
  await fastify.register(authPlugin);

  // Root endpoint
  fastify.get('/', {
    schema: {
      tags: ['Info'],
      description: 'API information and available endpoints',
      response: {
        200: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: { type: 'string' },
            description: { type: 'string' },
            endpoints: {
              type: 'object',
              properties: {
                health: { type: 'string' },
                users: { type: 'string' },
                receipts: { type: 'string' },
                documentation: { type: 'string' }
              }
            },
            documentation: { type: 'string' },
            status: { type: 'string' },
            authentication: { type: 'string' }
          }
        }
      }
    }
  }, async () => ({
    name: 'Driversnote Assessment API',
    version: '1.0.0',
    description: 'A secure API service for managing users and receipts with Turso database',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      receipts: '/api/receipts',
      documentation: '/docs'
    },
    documentation: '/docs',
    status: 'running',
    authentication: 'API Key required (X-API-Key header) for all endpoints except /api/health and this root endpoint'
  }));

  // Health check endpoint
  fastify.get('/api/health', {
    schema: {
      tags: ['Health'],
      description: 'Health check endpoint',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            database: { type: 'string' },
            version: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    const healthResponse: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: isConnected() ? 'connected' : 'disconnected',
      version: process.env['npm_package_version'] || '1.0.0',
    };
    return healthResponse;
  });

  // Register API routes
  await fastify.register(usersRoutes, { prefix: '/api' });
  await fastify.register(receiptsRoutes, { prefix: '/api' });

  return fastify;
}

// --- Serverless handler for Vercel ---

let appPromise: Promise<FastifyInstance> | null = null;

function getApp(): Promise<FastifyInstance> {
  if (!appPromise) {
    appPromise = buildApp().then(async (app) => {
      await app.ready();
      return app;
    });
  }
  return appPromise;
}

// Default export for @vercel/node
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const app = await getApp();
  app.server.emit('request', req, res);
}

// --- Local development server ---

async function start(): Promise<void> {
  try {
    const app = await buildApp();

    await app.listen({
      port: config.port,
      host: config.host,
    });

    console.log(`🚀 Server running on http://${config.host}:${config.port}`);
    console.log(`📚 API Documentation: http://${config.host}:${config.port}/docs`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n🔄 Received ${signal}, shutting down gracefully...`);
  try {
    await closeDb();
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Only start the server when not running on Vercel
if (!process.env['VERCEL']) {
  start().catch(console.error);
}
