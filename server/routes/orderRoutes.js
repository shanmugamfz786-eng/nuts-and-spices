import express from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, getMyOrders, cancelOrder, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

// Rate limiter for order creation: 20 requests per 15 minutes per IP
const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many order requests from this IP. Please try again after 15 minutes.' }
});

router.post('/', createOrderLimiter, createOrder);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id', optionalAuthMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);
router.put('/:id/cancel', authMiddleware, cancelOrder);

export default router;
