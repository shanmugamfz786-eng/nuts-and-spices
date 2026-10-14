import express from 'express';
import rateLimit from 'express-rate-limit';
import { createPaymentSession, verifyPayment } from '../controllers/paymentController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 min window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many payment requests from this IP. Please try again after 15 minutes.' }
});

router.post('/create-session', paymentRateLimiter, optionalAuthMiddleware, createPaymentSession);
router.post('/verify', paymentRateLimiter, optionalAuthMiddleware, verifyPayment);

export default router;
