import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index.js';
import { memoryStore } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const generateToken = (role = 'customer', id = 'usr_123') => {
  return jwt.sign({ id, name: 'Test User', phone: '9876543210', role }, JWT_SECRET, { expiresIn: '1h' });
};

describe('Security and Reliability Test Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Unauthenticated POST /api/catalog -> 401; non-admin -> 403; admin -> 200
  describe('POST /api/catalog security checks', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app)
        .post('/api/catalog')
        .send({ products: [], categories: [] });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 403 when authenticated as a customer (non-admin)', async () => {
      const customerToken = generateToken('customer');
      const res = await request(app)
        .post('/api/catalog')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ products: [], categories: [] });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('returns 200 when authenticated as an admin with valid arrays', async () => {
      const adminToken = generateToken('admin');
      const res = await request(app)
        .post('/api/catalog')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ products: [], categories: [] });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 2. Unauthenticated GET /api/orders -> 401; non-admin -> 403
  describe('GET /api/orders security checks', () => {
    it('returns 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 403 when requester is a non-admin user', async () => {
      const customerToken = generateToken('customer');
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  // 3. createOrder ignores client-sent price and discountAmount and recomputes the total
  describe('POST /api/orders price and coupon recomputation', () => {
    it('ignores client-sent price and discountAmount and calculates total from catalog', async () => {
      const orderPayload = {
        customer: {
          name: 'John Doe',
          phone: '9876543210',
          address: '123 Test Street',
          city: 'Chennai',
          pincode: '600001'
        },
        // Client attempts to claim an arbitrary 500 Rs discount and cheap 1 Rs price
        discountAmount: 500,
        subtotal: 1,
        totalAmount: 1,
        items: [
          {
            id: 'ndf-01',
            cartItemId: 'ndf-01-250g',
            name: 'California Jumbo Almonds (Badam)',
            weight: '250g',
            price: 1, // client tries 1 INR instead of catalog price
            quantity: 2
          }
        ]
      };

      const res = await request(app)
        .post('/api/orders')
        .send(orderPayload);

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);

      const createdOrder = res.body.order;
      // Should not have accepted client's totalAmount: 1
      expect(createdOrder.totalAmount).toBeGreaterThan(1);
      // Client-sent discountAmount without valid couponCode is ignored
      expect(createdOrder.discountAmount || 0).toBe(0);
    });
  });

  // 4. Payment verify rejects when the Cashfree amount does not match the order total
  describe('POST /api/payment/verify amount check', () => {
    it('rejects when Cashfree order_amount does not match order total_amount', async () => {
      // 1. Create a real order via createOrder endpoint so it exists in DB / memory
      const orderRes = await request(app)
        .post('/api/orders')
        .send({
          customer: {
            name: 'Payment Tester',
            phone: '9876543210',
            address: '456 Test Lane',
            city: 'Chennai',
            pincode: '600002'
          },
          items: [
            {
              id: 'ndf-01',
              cartItemId: 'ndf-01-250g',
              name: 'California Jumbo Almonds (Badam)',
              weight: '250g',
              price: 340,
              quantity: 1
            }
          ]
        });

      expect([200, 201]).toContain(orderRes.status);
      const testOrderId = orderRes.body.order.id;

      // Mock global fetch to simulate Cashfree returning a mismatched amount (e.g. 50 instead of order total)
      const mockCashfreeFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          order_id: testOrderId,
          order_amount: '50.00', // tampered amount
          order_status: 'PAID'
        })
      });
      global.fetch = mockCashfreeFetch;

      const res = await request(app)
        .post('/api/payment/verify')
        .send({ orderId: testOrderId, phone4: '3210' });

      expect(res.status).toBe(200);
      expect(res.body.isPaid).toBe(false);
      expect(res.body.message).toContain('Payment amount does not match order amount');
    });
  });
});
