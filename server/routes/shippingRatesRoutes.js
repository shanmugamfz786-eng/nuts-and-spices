import express from 'express';
import {
  getPublicShippingRates,
  calculateShippingFee,
  getAllShippingRatesAdmin,
  createShippingRateAdmin,
  updateShippingRateAdmin,
  deleteShippingRateAdmin
} from '../controllers/shippingRatesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// 1. Customer Public Routes
router.get('/', getPublicShippingRates);
router.post('/calculate', calculateShippingFee);

// 2. Admin Protected Routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllShippingRatesAdmin);
router.post('/admin/create', authMiddleware, adminMiddleware, createShippingRateAdmin);
router.put('/admin/:id', authMiddleware, adminMiddleware, updateShippingRateAdmin);
router.delete('/admin/:id', authMiddleware, adminMiddleware, deleteShippingRateAdmin);

export default router;

