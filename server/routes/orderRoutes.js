import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, getMyOrders, cancelOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.put('/:id/cancel', authMiddleware, cancelOrder);

export default router;
