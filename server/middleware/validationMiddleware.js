import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  phone: z.string().trim().min(10, 'Valid 10-digit mobile number required'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128)
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Mobile number or email required').max(100),
  password: z.string().min(1, 'Password is required').max(128)
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    phone: z.string().trim().min(10, 'Valid 10-digit mobile number required').max(20),
    email: z.string().trim().email().optional().or(z.literal('')).nullable(),
    address: z.string().trim().min(5, 'Delivery address is required').max(300),
    city: z.string().trim().min(2, 'City is required').max(50),
    state: z.string().trim().max(50).optional().nullable(),
    pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be a 6-digit number'),
    notes: z.string().trim().max(500).optional().or(z.literal('')).nullable()
  }),
  items: z.array(z.object({
    id: z.string().optional(),
    productId: z.string().optional(),
    cartItemId: z.string().optional(),
    name: z.string().optional(),
    image: z.string().optional(),
    categoryName: z.string().optional(),
    weight: z.string().optional(),
    price: z.number().nonnegative().optional(),
    quantity: z.number().int().min(1).max(100)
  }).transform(item => ({
    ...item,
    id: item.id || item.productId || '',
    productId: item.productId || item.id || ''
  })).refine(item => Boolean(item.id || item.productId), {
    message: 'Each item must have a valid product id'
  })).min(1, 'Cart is empty').max(50, 'Too many items in order (max 50)'),
  couponCode: z.string().trim().max(50).optional().or(z.literal('')).nullable(),
  discountAmount: z.number().optional().nullable(),
  notes: z.string().trim().max(500).optional().or(z.literal('')).nullable()
});

export const catalogPayloadSchema = z.object({
  products: z.array(z.record(z.any())).max(500, 'Maximum 500 products allowed'),
  categories: z.array(z.record(z.any())).max(100, 'Maximum 100 categories allowed')
});

export const adminProductSchema = z.object({
  name: z.string().trim().min(2).max(200),
  category: z.string().trim().max(100).optional(),
  categoryName: z.string().trim().max(100).optional(),
  badge: z.string().trim().max(50).optional(),
  image: z.string().trim().max(2000).optional(),
  weights: z.array(z.object({
    label: z.string().min(1),
    price: z.number().nonnegative()
  })).optional(),
  description: z.string().trim().max(2000).optional(),
  origin: z.string().trim().max(100).optional(),
  shelfLife: z.string().trim().max(50).optional(),
  stock: z.number().int().nonnegative().optional(),
  status: z.string().trim().max(20).optional()
});

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  image: z.string().trim().max(2000).optional(),
  description: z.string().trim().max(1000).optional(),
  status: z.string().trim().max(20).optional()
});

/**
 * Middleware generator for Zod validation
 */
export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError || err.name === 'ZodError') {
      const issues = err.issues || err.errors || [];
      return res.status(400).json({
        success: false,
        message: issues[0]?.message || 'Validation error',
        errors: issues.map(e => ({ field: (e.path || []).join('.'), message: e.message }))
      });
    }
    next(err);
  }
};
