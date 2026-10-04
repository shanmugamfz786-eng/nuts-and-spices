import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { initializeDatabase } from './scripts/initDb.js';
import { queryDb } from './config/db.js';
import { CATEGORIES, PRODUCTS } from '../src/data/products.js';

dotenv.config();

// Initialize TiDB database schema & seeds on server startup
initializeDatabase().catch(err => console.warn('Database initialization note:', err.message));

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'HAJI NUTS & SPICES Gourmet Backend',
    database: 'TiDB / MySQL Compatible',
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

    // Save to /tmp filesystem for Vercel Lambda container reuse
    try {
      const fs = await import('fs');
      fs.writeFileSync('/tmp/master_catalog.json', catalogJson);
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

  // 2. If not found in DB settings, check /tmp file fallback on Vercel
  if (!hasMasterCatalog) {
    try {
      const fs = await import('fs');
      if (fs.existsSync('/tmp/master_catalog.json')) {
        const fileData = JSON.parse(fs.readFileSync('/tmp/master_catalog.json', 'utf8'));
        if (fileData && Array.isArray(fileData.products) && Array.isArray(fileData.categories)) {
          products = fileData.products.map(p => ({
            ...p,
            image: p.image || seedProductImageMap.get(p.id) || ''
          }));
          categories = fileData.categories;
          updatedAt = fileData.updatedAt || updatedAt;
          hasMasterCatalog = true;
        }
      }
    } catch {}
  }

  // 3. Only if NO master catalog was ever saved, initialize from seed PRODUCTS and CATEGORIES
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

app.post('/api/catalog', async (req, res) => {
  const { products, categories } = req.body || {};
  if (Array.isArray(products) && Array.isArray(categories)) {
    await syncServerCatalog(products, categories);
    return res.json({ success: true, message: 'Catalog updated across all devices successfully' });
  }
  return res.status(400).json({ success: false, message: 'Invalid payload' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Only listen on port if run directly as the main script (never when imported by api/index.js or Vercel)
const isServerDirectRun = Boolean(process.argv[1] && (process.argv[1].endsWith('server\\index.js') || process.argv[1].endsWith('server/index.js')));
if (isServerDirectRun) {
  app.listen(PORT, async () => {
    console.log(`\n🚀 HAJI NUTS & SPICES Backend running on http://localhost:${PORT}`);
    console.log(`🔌 Database Engine: TiDB / MySQL Compatible`);
    await initializeDatabase();
  });
}

export default app;
