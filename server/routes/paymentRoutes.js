import express from 'express';
import { createPaymentSession, verifyPayment } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-session', createPaymentSession);
router.post('/verify', verifyPayment);

export default router;
