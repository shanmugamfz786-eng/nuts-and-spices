import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getAllProducts, getProductById, getAllCategories, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

import { adminProductSchema, validateBody } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/categories', getAllCategories);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, adminMiddleware, validateBody(adminProductSchema), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, validateBody(adminProductSchema.partial()), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
