import express from 'express';
import {
  createPincodePricing,
  getAllPincodePricings,
  updatePincodePricing,
  deletePincodePricing,
  getCustomerPincodePrices
} from '../controllers/pincodePricingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { validateBody, pincodePricingSchema, updatePincodePricingSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

// 1. Customer Public Route: Fetch prices configured for a delivery pincode
// GET /api/pincode-pricing?pincode=600017 OR GET /api/pincode-pricing/600017
router.get('/lookup', getCustomerPincodePrices);
router.get('/:pincode', (req, res, next) => {
  if (req.params.pincode === 'admin') return next();
  return getCustomerPincodePrices(req, res, next);
});
router.get('/', getCustomerPincodePrices);

// 2. Admin Protected Routes (requires valid admin auth token)
router.get('/admin/all', authMiddleware, adminMiddleware, getAllPincodePricings);
router.post('/admin/create', authMiddleware, adminMiddleware, validateBody(pincodePricingSchema), createPincodePricing);
router.put('/admin/:id', authMiddleware, adminMiddleware, validateBody(updatePincodePricingSchema), updatePincodePricing);
router.delete('/admin/:id', authMiddleware, adminMiddleware, deletePincodePricing);

export default router;

