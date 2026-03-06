import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { getClient } from '../utils/db';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  InitializeUsersRequest,
  userSchema,
  createUserSchema
} from '../types';
import { RouteSchema } from '../types/swagger';

// Authentication function
async function authenticateRequest(request: FastifyRequest, reply: FastifyReply): Promise<boolean> {
  const apiKey = request.headers['x-api-key'] as string;

  if (!apiKey) {
    reply.code(401).send({
      error: 'API key is required',
      message: 'Please provide a valid API key in the X-API-Key header'
    });
    return false;
  }

  const expectedApiKey = process.env['API_KEY'];

  if (!expectedApiKey) {
    reply.code(500).send({
      error: 'Server configuration error',
      message: 'API key not configured on server'
    });
    return false;
  }

  if (apiKey !== expectedApiKey) {
    reply.code(401).send({
      error: 'Invalid API key',
      message: 'The provided API key is invalid'
    });
    return false;
  }

  return true;
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row['id'] as number,
    full_name: row['full_name'] as string,
    tag: (row['tag'] as string) ?? undefined,
    address1: row['address1'] as string | null,
    address2: row['address2'] as string | null,
    postal_code: row['postal_code'] as string | null,
    city: row['city'] as string | null,
    country_name: (row['country_name'] as string) ?? undefined,
    country_id: (row['country_id'] as string) ?? undefined,
    organisation_id: row['organisation_id'] as number | null,
  };
}

const usersRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Get all users
  fastify.get('/users', {
    schema: {
      tags: ['Users'],
      description: 'Get all users',
      security: [{ apiKey: [] }],
      response: {
        200: {
          type: 'array',
          items: userSchema
        }
      }
    } satisfies RouteSchema
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const isAuthenticated = await authenticateRequest(request, reply);
    if (!isAuthenticated) return;

    try {
      const db = getClient();
      const result = await db.execute('SELECT * FROM users ORDER BY id');
      const users = result.rows.map((row) => rowToUser(row as unknown as Record<string, unknown>));
      reply.send(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      reply.code(500).send({ success: false, error: 'Failed to fetch users' });
    }
  });

  // Get user by ID
  fastify.get('/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Get user by ID',
      security: [{ apiKey: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      response: {
        200: userSchema,
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    } satisfies RouteSchema
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const isAuthenticated = await authenticateRequest(request, reply);
    if (!isAuthenticated) return;

    try {
      const userId = parseInt((request.params as { id: string }).id);
      if (isNaN(userId)) {
        reply.code(400).send({ success: false, error: 'Invalid user ID' });
        return;
      }

      const db = getClient();
      const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });

      if (result.rows.length === 0) {
        reply.code(404).send({ success: false, error: 'User not found' });
        return;
      }

      reply.send(rowToUser(result.rows[0] as unknown as Record<string, unknown>));
    } catch (error) {
      console.error('Error fetching user:', error);
      reply.code(500).send({ success: false, error: 'Failed to fetch user' });
    }
  });

  // Create new user
  fastify.post('/users', {
    schema: {
      tags: ['Users'],
      description: 'Create a new user',
      security: [{ apiKey: [] }],
      body: createUserSchema,
      response: { 201: userSchema }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const isAuthenticated = await authenticateRequest(request, reply);
    if (!isAuthenticated) return;

    try {
      const userData = request.body as CreateUserRequest;
      const db = getClient();

      const result = await db.execute({
        sql: `INSERT INTO users (full_name, tag, address1, address2, postal_code, city, country_name, country_id, organisation_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          userData.full_name,
          userData.tag ?? null,
          userData.address1 ?? null,
          userData.address2 ?? null,
          userData.postal_code?.toString() ?? null,
          userData.city ?? null,
          userData.country_name ?? null,
          userData.country_id ?? null,
          userData.organisation_id ?? null,
        ],
      });

      const newId = Number(result.lastInsertRowid);
      const newUser: User = { ...userData, id: newId };
      reply.code(201).send(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      reply.code(500).send({ success: false, error: 'Failed to create user' });
    }
  });

  // Update user
  fastify.put('/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Update user by ID',
      security: [{ apiKey: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          full_name: { type: 'string' },
          tag: { type: 'string' },
          address1: { type: 'string', nullable: true },
          address2: { type: 'string', nullable: true },
          postal_code: { type: ['number', 'string'], nullable: true },
          city: { type: 'string', nullable: true },
          country_name: { type: 'string' },
          country_id: { type: 'string' },
          organisation_id: { type: 'number', nullable: true }
        }
      },
      response: {
        200: userSchema,
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const isAuthenticated = await authenticateRequest(request, reply);
    if (!isAuthenticated) return;

    try {
      const userId = parseInt((request.params as { id: string }).id);
      if (isNaN(userId)) {
        reply.code(400).send({ success: false, error: 'Invalid user ID' });
        return;
      }

      const userData = request.body as UpdateUserRequest;
      const db = getClient();

      const fields: string[] = [];
      const values: (string | number | null)[] = [];

      if (userData.full_name !== undefined) { fields.push('full_name = ?'); values.push(userData.full_name); }
      if (userData.tag !== undefined) { fields.push('tag = ?'); values.push(userData.tag); }
      if (userData.address1 !== undefined) { fields.push('address1 = ?'); values.push(userData.address1 ?? null); }
      if (userData.address2 !== undefined) { fields.push('address2 = ?'); values.push(userData.address2 ?? null); }
      if (userData.postal_code !== undefined) { fields.push('postal_code = ?'); values.push(userData.postal_code?.toString() ?? null); }
      if (userData.city !== undefined) { fields.push('city = ?'); values.push(userData.city ?? null); }
      if (userData.country_name !== undefined) { fields.push('country_name = ?'); values.push(userData.country_name); }
      if (userData.country_id !== undefined) { fields.push('country_id = ?'); values.push(userData.country_id); }
      if (userData.organisation_id !== undefined) { fields.push('organisation_id = ?'); values.push(userData.organisation_id ?? null); }

      if (fields.length === 0) {
        reply.code(400).send({ success: false, error: 'No fields to update' });
        return;
      }

      values.push(userId);
      const result = await db.execute({
        sql: `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        args: values,
      });

      if (result.rowsAffected === 0) {
        reply.code(404).send({ success: false, error: 'User not found' });
        return;
      }

      const updated = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
      reply.send(rowToUser(updated.rows[0] as unknown as Record<string, unknown>));
    } catch (error) {
      console.error('Error updating user:', error);
      reply.code(500).send({ success: false, error: 'Failed to update user' });
    }
  });

  // Delete user
  fastify.delete('/users/:id', {
    schema: {
      tags: ['Users'],
      description: 'Delete user by ID',
      security: [{ apiKey: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: { success: { type: 'boolean' } }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const isAuthenticated = await authenticateRequest(request, reply);
    if (!isAuthenticated) return;

    try {
      const userId = parseInt((request.params as { id: string }).id);
      if (isNaN(userId)) {
        reply.code(400).send({ success: false, error: 'Invalid user ID' });
        return;
      }

      const db = getClient();
      const result = await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [userId] });

      if (result.rowsAffected === 0) {
        reply.code(404).send({ success: false, error: 'User not found' });
        return;
      }

      reply.send({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      reply.code(500).send({ success: false, error: 'Failed to delete user' });
    }
  });

  // Initialize users
  fastify.post('/users/initialize', {
    schema: {
      tags: ['Users'],
      description: 'Initialize users table',
      security: [{ apiKey: [] }],
      body: {
        type: 'object',
        properties: {
          users: { type: 'array', items: userSchema }
        },
        required: ['users']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const isAuthenticated = await authenticateRequest(request, reply);
    if (!isAuthenticated) return;

    try {
      const { users } = request.body as InitializeUsersRequest;
      const db = getClient();

      const countResult = await db.execute('SELECT COUNT(*) as count FROM users');
      const existingCount = (countResult.rows[0] as unknown as Record<string, unknown>)['count'] as number;

      if (existingCount === 0) {
        for (const user of users) {
          await db.execute({
            sql: `INSERT INTO users (id, full_name, tag, address1, address2, postal_code, city, country_name, country_id, organisation_id)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              user.id,
              user.full_name,
              user.tag ?? null,
              user.address1 ?? null,
              user.address2 ?? null,
              user.postal_code?.toString() ?? null,
              user.city ?? null,
              user.country_name ?? null,
              user.country_id ?? null,
              user.organisation_id ?? null,
            ],
          });
        }
        reply.send({ success: true, message: `Initialized ${users.length} users` });
      } else {
        reply.send({ success: true, message: `Table already has ${existingCount} users` });
      }
    } catch (error) {
      console.error('Error initializing users:', error);
      reply.code(500).send({
        success: false,
        message: 'Failed to initialize users',
        error: 'Failed to initialize users',
      });
    }
  });
};

export default usersRoutes;
