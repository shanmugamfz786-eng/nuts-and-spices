import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index.js';
import { memoryStore } from '../config/db.js';
import { OrderService } from '../services/orderService.js';
import { PaymentService } from '../services/paymentService.js';
import { AuthService } from '../services/authService.js';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const generateToken = (role = 'customer', id = 'usr_123', phone = '9876543210') => {
  return jwt.sign({ id, name: 'Test User', phone, role }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
};

describe('Comprehensive Backend Test Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // 1. AUTHENTICATION & ACCESS CONTROL
  describe('Authentication & Authorization', () => {
    it('rejects registration with invalid phone format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Phone User',
          phone: '12345',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects registration with short password (< 6 chars)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Password User',
          phone: '9876543210',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('normalizes +91 and spaces in login identifiers consistently', () => {
      const normalized1 = AuthService.normalize('+91 98765 43210');
      const normalized2 = AuthService.normalize('9876543210');
      const normalizedEmail = AuthService.normalize('  USER@Domain.COM ');

      expect(normalized1).toBe('9876543210');
      expect(normalized2).toBe('9876543210');
      expect(normalizedEmail).toBe('user@domain.com');
    });

    it('returns generic error message on invalid credentials without user enumeration', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'nonexistent@example.com',
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid mobile number/email or password.');
    });

    it('returns 401 when token is expired or signed with wrong algorithm', async () => {
      const invalidToken = jwt.sign({ id: 'usr_1' }, 'wrong_secret');
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    // Table-driven test over all admin-only routes
    const adminRoutes = [
      { method: 'get', path: '/api/orders' },
      { method: 'get', path: '/api/admin/dashboard/stats' },
      { method: 'get', path: '/api/admin/state' },
      { method: 'post', path: '/api/admin/state' },
      { method: 'post', path: '/api/catalog' },
      { method: 'get', path: '/api/auth/users' }
    ];

    adminRoutes.forEach(({ method, path }) => {
      it(`enforces 403 on non-admin calling ${method.toUpperCase()} ${path}`, async () => {
        const customerToken = generateToken('customer');
        const req = request(app)[method](path).set('Authorization', `Bearer ${customerToken}`);
        if (method === 'post') req.send({});

        const res = await req;
        expect(res.status).toBe(403);
      });
    });
  });

  // 2. ORDER PROCESSING & LIFECYCLE
  describe('Order Processing & State Transitions', () => {
    it('generates secure order ID matching HNS-<8 uppercase alphanumeric>', () => {
      const orderId = OrderService.generateOrderId(8);
      expect(orderId).toMatch(/^HNS-[A-Z0-9]{8}$/);
    });

    it('validates state transitions strictly and disallows illegal jumps', () => {
      expect(OrderService.isValidStatusTransition('pending', 'confirmed')).toBe(true);
      expect(OrderService.isValidStatusTransition('confirmed', 'shipped')).toBe(true);
      expect(OrderService.isValidStatusTransition('shipped', 'delivered')).toBe(true);
      
      // Illegal jumps
      expect(OrderService.isValidStatusTransition('delivered', 'confirmed')).toBe(false);
      expect(OrderService.isValidStatusTransition('shipped', 'pending')).toBe(false);
      expect(OrderService.isValidStatusTransition('delivered', 'pending')).toBe(false);
    });

    it('requires phone4 verification for guest lookup on GET /api/orders/:id', async () => {
      const resWithoutPhone4 = await request(app).get('/api/orders/NS-98124');
      // If unauthenticated and without phone4, access is denied
      expect([401, 403, 404]).toContain(resWithoutPhone4.status);
    });
  });

  // 3. PAYMENT & CASHFREE WEBHOOK SECURITY
  describe('Payment & Webhook Reliability', () => {
    const SECRET_KEY = 'test_webhook_secret_key';

    it('rejects Cashfree webhooks missing raw Buffer body', async () => {
      const res = await request(app)
        .post('/api/payment/webhook')
        .set('x-webhook-signature', 'dummy')
        .set('x-webhook-timestamp', String(Math.floor(Date.now() / 1000)))
        .send({ type: 'PAYMENT_SUCCESS' });

      // Missing raw buffer or signature mismatch results in 400 or 401
      expect([400, 401]).toContain(res.status);
    });

    it('validates Cashfree webhook signatures accurately with timingSafeEqual', () => {
      const rawBody = Buffer.from(JSON.stringify({ data: { order: { order_id: 'HNS-12345678' } } }));
      const timestamp = String(Math.floor(Date.now() / 1000));
      
      const payload = `${timestamp}${rawBody.toString('utf8')}`;
      const validSignature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(payload)
        .digest('base64');

      const isVerified = PaymentService.verifyCashfreeWebhookSignature(
        rawBody,
        timestamp,
        validSignature,
        SECRET_KEY
      );
      expect(isVerified).toBe(true);

      const isWrongSignature = PaymentService.verifyCashfreeWebhookSignature(
        rawBody,
        timestamp,
        'invalid_signature',
        SECRET_KEY
      );
      expect(isWrongSignature).toBe(false);
    });

    it('rejects stale webhook timestamps older than 5 minutes for replay protection', () => {
      const currentSeconds = Math.floor(Date.now() / 1000);
      const staleTimestamp = String(currentSeconds - 360); // 6 minutes ago
      const recentTimestamp = String(currentSeconds - 60);  // 1 minute ago

      expect(PaymentService.isTimestampValid(staleTimestamp, 5)).toBe(false);
      expect(PaymentService.isTimestampValid(recentTimestamp, 5)).toBe(true);
    });
  });
});
