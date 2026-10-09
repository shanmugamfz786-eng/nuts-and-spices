import express from 'express';
import { createPaymentSession, verifyPayment } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-session', authMiddleware, createPaymentSession);
router.post('/verify', authMiddleware, verifyPayment);

export default router;
