import express from 'express';
import rateLimit from 'express-rate-limit';
import { createPaymentSession, verifyPayment, handleCashfreeWebhook } from '../controllers/paymentController.js';

const router = express.Router();

const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 min window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment requests from this IP. Please try again after 15 minutes.' }
});

router.post('/create-session', paymentRateLimiter, createPaymentSession);
router.post('/verify', paymentRateLimiter, verifyPayment);
// Cashfree webhook uses raw request body
router.post('/webhook', express.raw({ type: 'application/json' }), handleCashfreeWebhook);

export default router;
