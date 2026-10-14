import express from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, getMyOrders, cancelOrder, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

import { createOrderSchema, validateBody } from '../middleware/validationMiddleware.js';

// Rate limiter for order creation: 20 requests per 15 minutes per IP
const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many order requests from this IP. Please try again after 15 minutes.' }
});

// Rate limiter for single order lookups to prevent enumeration attacks
const getOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // 60 lookups per 15 min window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many order lookup requests. Please try again later.' }
});

router.post('/', createOrderLimiter, validateBody(createOrderSchema), createOrder);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id', getOrderLimiter, optionalAuthMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);
router.put('/:id/cancel', authMiddleware, cancelOrder);

export default router;
