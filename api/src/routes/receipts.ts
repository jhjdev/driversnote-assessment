import { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { getClient } from '../utils/db';
import {
  Receipt,
  CreateReceiptRequest,
  receiptSchema,
  createReceiptSchema
} from '../types';
import { RouteSchema } from '../types/swagger';

function rowToReceipt(row: Record<string, unknown>): Receipt {
  return {
    id: row['id'] as string,
    userId: row['user_id'] as number,
    userName: row['user_name'] as string,
    beaconQuantity: row['beacon_quantity'] as number,
    discount: row['discount'] as number,
    deliveryAddress: row['delivery_address'] as string,
    totalPrice: row['total_price'] as number,
    timestamp: row['timestamp'] as string,
  };
}

const receiptsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Get all receipts
  fastify.get('/receipts', {
    preHandler: fastify.authenticate,
    schema: {
      tags: ['Receipts'],
      description: 'Get all receipts',
      security: [{ apiKey: [] }],
      response: {
        200: {
          type: 'array',
          items: receiptSchema
        }
      }
    } satisfies RouteSchema
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const db = getClient();
      const result = await db.execute('SELECT * FROM receipts ORDER BY timestamp DESC');
      const receipts = result.rows.map((row) => rowToReceipt(row as unknown as Record<string, unknown>));
      reply.send(receipts);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      reply.code(500).send({ success: false, error: 'Failed to fetch receipts' });
    }
  });

  // Create new receipt
  fastify.post('/receipts', {
    preHandler: fastify.authenticate,
    schema: {
      tags: ['Receipts'],
      description: 'Create a new receipt',
      security: [{ apiKey: [] }],
      body: createReceiptSchema,
      response: { 201: receiptSchema }
    } satisfies RouteSchema
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const receiptData = request.body as CreateReceiptRequest;
      const db = getClient();

      const id = new Date().getTime().toString();
      const timestamp = new Date().toISOString();

      await db.execute({
        sql: `INSERT INTO receipts (id, user_id, user_name, beacon_quantity, discount, delivery_address, total_price, timestamp)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          receiptData.userId,
          receiptData.userName,
          receiptData.beaconQuantity,
          receiptData.discount,
          receiptData.deliveryAddress,
          receiptData.totalPrice,
          timestamp,
        ],
      });

      const newReceipt: Receipt = {
        ...receiptData,
        id,
        timestamp,
      };

      reply.code(201).send(newReceipt);
    } catch (error) {
      console.error('Error creating receipt:', error);
      reply.code(500).send({ success: false, error: 'Failed to create receipt' });
    }
  });

  // Delete receipt
  fastify.delete('/receipts/:id', {
    preHandler: fastify.authenticate,
    schema: {
      tags: ['Receipts'],
      description: 'Delete receipt by ID',
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
    } satisfies RouteSchema
  }, async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const receiptId = (request.params as { id: string }).id;
      const db = getClient();

      const result = await db.execute({ sql: 'DELETE FROM receipts WHERE id = ?', args: [receiptId] });

      if (result.rowsAffected === 0) {
        reply.code(404).send({ success: false, error: 'Receipt not found' });
        return;
      }

      reply.send({ success: true });
    } catch (error) {
      console.error('Error deleting receipt:', error);
      reply.code(500).send({ success: false, error: 'Failed to delete receipt' });
    }
  });
};

export default receiptsRoutes;
