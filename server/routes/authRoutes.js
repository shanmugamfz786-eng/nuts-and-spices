import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerCustomer, loginUser, getCurrentUser, updateCurrentUser, getAllUsers, deleteUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

router.post('/register', authLimiter, registerCustomer);
router.post('/login', authLimiter, loginUser);
router.get('/me', getCurrentUser);
router.put('/me', authMiddleware, updateCurrentUser);

// Admin routes for user management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
