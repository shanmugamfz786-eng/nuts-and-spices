import express from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getAllProducts, getProductById, getAllCategories, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

import { adminProductSchema, validateBody } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/categories', getAllCategories);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', optionalAuthMiddleware, validateBody(adminProductSchema), createProduct);
router.put('/:id', optionalAuthMiddleware, validateBody(adminProductSchema.partial()), updateProduct);
router.delete('/:id', optionalAuthMiddleware, deleteProduct);

export default router;
