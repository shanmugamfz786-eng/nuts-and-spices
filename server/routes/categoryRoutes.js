import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';

import { adminCategorySchema, validateBody } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, adminMiddleware, validateBody(adminCategorySchema), createCategory);
router.put('/:id', authMiddleware, adminMiddleware, validateBody(adminCategorySchema.partial()), updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;
