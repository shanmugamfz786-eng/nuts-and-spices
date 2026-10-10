import mysql from 'mysql2/promise';
import { CATEGORIES, PRODUCTS } from '../../src/data/products.js';

import 'dotenv/config';

async function syncTiDB() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connected to TiDB Cloud!');

  // 1. Remove unwanted test categories
  await conn.execute("DELETE FROM categories WHERE id IN ('cross-browser-sync', 'all')");

  // 2. Ensure each category has user's original base64 image
  for (const cat of CATEGORIES) {
    await conn.execute(
      `INSERT INTO categories (id, name, image, description, status) 
       VALUES (?, ?, ?, ?, 'active') 
       ON DUPLICATE KEY UPDATE name = VALUES(name), image = VALUES(image)`,
      [cat.id, cat.name, cat.image, cat.description || '']
    );
  }

  // 3. Clear settings table and save clean master_catalog_json
  // For master_catalog_json, products are saved with their fields and categories with original base64
  const catalogJson = JSON.stringify({
    products: PRODUCTS,
    categories: CATEGORIES,
    updatedAt: new Date().toISOString()
  });

  await conn.execute(
    `INSERT INTO settings (setting_key, setting_value) 
     VALUES ('master_catalog_json', ?) 
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [catalogJson]
  );

  const [cats] = await conn.execute('SELECT id, name, LEFT(image, 30) as imgStart, LENGTH(image) as len FROM categories');
  console.log('Categories synced with user Base64 images count:', cats.length);
  console.log(cats);

  const [settings] = await conn.execute("SELECT setting_key, LENGTH(setting_value) as len FROM settings WHERE setting_key = 'master_catalog_json'");
  console.log('Master catalog setting saved, length:', settings[0]?.len);

  await conn.end();
  console.log('✅ TiDB Cloud synced successfully!');
}

syncTiDB().catch(console.error);
