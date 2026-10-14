import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { initializeDatabase } from './scripts/initDb.js';
import { queryDb } from './config/db.js';
import { CATEGORIES, PRODUCTS } from '../src/data/products.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { adminMiddleware } from './middleware/adminMiddleware.js';

import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS configuration
const envFrontendUrls = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'https://www.hajinutsandspices.com',
  'https://hajinutsandspices.com',
  ...envFrontendUrls
];

const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, webhooks, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');

    // Check strict allowlist
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow localhost/127.0.0.1 in non-production environments
    if (process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview URLs only if explicitly enabled via env flag
    if (allowVercelPreviews && /^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  credentials: true
}));

// Route-specific parser for admin state & catalog sync before global 1MB limit
app.use('/api/admin/state', express.json({ limit: '20mb' }));
app.use('/api/catalog', express.json({ limit: '20mb' }));

// Global body limit lowered to 1mb
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'down';
  let dbError = null;

  try {
    const pool = (await import('./config/db.js')).getPool();
    await pool.query('SELECT 1');
    dbStatus = 'up';
  } catch (err) {
    dbError = err.message;
  }

  const isHealthy = dbStatus === 'up';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'online' : 'degraded',
    store: 'HAJI NUTS & SPICES Gourmet Backend',
    database: dbStatus,
    ...(dbError && { error: dbError }),
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    store: 'HAJI NUTS & SPICES Gourmet Backend API',
    timestamp: new Date().toISOString()
  });
});

// In-Memory Master Catalog cache for fast real-time Edge/Vercel Sync
export let inMemoryCatalog = {
  products: null,
  categories: null,
  updatedAt: null
};

const seedProductImageMap = new Map(PRODUCTS.map(p => [p.id, p.image]));

export const syncServerCatalog = async (products, categories) => {
  if (Array.isArray(products)) {
    inMemoryCatalog.products = products.map(p => ({
      ...p,
      image: p.image || seedProductImageMap.get(p.id) || ''
    }));
  }
  if (Array.isArray(categories)) {
    inMemoryCatalog.categories = categories;
  }
  inMemoryCatalog.updatedAt = new Date().toISOString();

  try {
    const catalogJson = JSON.stringify({
      products: inMemoryCatalog.products || PRODUCTS,
      categories: inMemoryCatalog.categories || CATEGORIES,
      updatedAt: inMemoryCatalog.updatedAt
    });

    await queryDb(
      "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      ['master_catalog_json', catalogJson, catalogJson]
    );

    // Sync categories table in TiDB Cloud
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        await queryDb(
          "INSERT INTO categories (id, name, image, description, status) VALUES (?, ?, ?, ?, 'active') ON DUPLICATE KEY UPDATE name = VALUES(name), image = VALUES(image)",
          [cat.id, cat.name, cat.image || '', cat.description || '']
        );
      }
    }

    // Also sync memoryStore so any in-memory queries see the exact active items
    try {
      const { memoryStore } = await import('./config/db.js');
      if (Array.isArray(inMemoryCatalog.products)) memoryStore.products = [...inMemoryCatalog.products];
      if (Array.isArray(inMemoryCatalog.categories)) memoryStore.categories = [...inMemoryCatalog.categories];
    } catch {}
  } catch (err) {
    console.warn('DB catalog sync note:', err.message);
  }
};

app.get('/api/catalog', async (req, res) => {
  let products = inMemoryCatalog.products;
  let categories = inMemoryCatalog.categories;
  let updatedAt = inMemoryCatalog.updatedAt || new Date().toISOString();
  let hasMasterCatalog = false;

  // 1. Try to load from master_catalog_json in settings table (TiDB Cloud)
  try {
    const rows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = 'master_catalog_json'");
    if (rows && rows.length > 0 && rows[0].setting_value) {
      const parsed = JSON.parse(rows[0].setting_value);
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.categories)) {
        products = parsed.products.map(p => ({
          ...p,
          image: p.image || seedProductImageMap.get(p.id) || ''
        }));
        categories = parsed.categories;
        updatedAt = parsed.updatedAt || updatedAt;
        hasMasterCatalog = true;
      }
    }
  } catch (err) {
    console.warn('DB catalog fetch note:', err.message);
  }

  // 2. Only if NO master catalog was ever saved, initialize from seed PRODUCTS and CATEGORIES
  if (!hasMasterCatalog) {
    products = products || PRODUCTS;
    categories = categories || CATEGORIES;
  }

  inMemoryCatalog.products = products;
  inMemoryCatalog.categories = categories;
  inMemoryCatalog.updatedAt = updatedAt;

  // Optimize payload over the wire: omit duplicate seed images to stay < 1MB (well below Vercel 4.5MB limit)
  const optimizedProducts = (products || []).map(p => {
    if (p.image && p.image === seedProductImageMap.get(p.id)) {
      const { image, ...rest } = p;
      return rest;
    }
    return p;
  });

  res.json({
    success: true,
    products: optimizedProducts,
    categories,
    updatedAt
  });
});

app.post('/api/catalog', authMiddleware, adminMiddleware, async (req, res) => {
  const { products, categories } = req.body || {};
  if (!Array.isArray(products) || !Array.isArray(categories)) {
    return res.status(400).json({ success: false, message: 'Invalid payload: products and categories must be arrays' });
  }

  // Cap array lengths to sensible limits to prevent payload bombs
  if (products.length > 500 || categories.length > 100) {
    return res.status(400).json({ 
      success: false, 
      message: 'Payload exceeds allowed limits (max 500 products, 100 categories)' 
    });
  }

  await syncServerCatalog(products, categories);
  return res.json({ success: true, message: 'Catalog updated across all devices successfully' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Only listen on port if run directly as the main script or hosted on Render/standard hosts (never when imported by Vercel serverless)
const isServerDirectRun = Boolean(
  process.env.RENDER ||
  (!process.env.VERCEL && process.argv[1] && (
    process.argv[1].endsWith('server\\index.js') || 
    process.argv[1].endsWith('server/index.js') ||
    process.argv[1].endsWith('index.js')
  ))
);
if (isServerDirectRun) {
  app.listen(PORT, async () => {
    console.log(`\n🚀 HAJI NUTS & SPICES Backend running on http://localhost:${PORT}`);
    console.log(`🔌 Database Engine: TiDB / MySQL Compatible`);
    await initializeDatabase();
  });
}

export default app;
