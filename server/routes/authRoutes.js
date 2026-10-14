import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerCustomer, loginUser, getCurrentUser, updateCurrentUser, getAllUsers, deleteUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

import { adminMiddleware } from '../middleware/adminMiddleware.js';

import { registerSchema, loginSchema, validateBody } from '../middleware/validationMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.' }
});

router.post('/register', authLimiter, validateBody(registerSchema), registerCustomer);
router.post('/login', authLimiter, validateBody(loginSchema), loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/me', authMiddleware, updateCurrentUser);

// Admin routes for user management
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
