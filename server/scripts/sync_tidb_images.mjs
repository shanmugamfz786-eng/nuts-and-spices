import { queryDb } from '../config/db.js';
import { PRODUCTS, CATEGORIES } from '../../src/data/products.js';

async function main() {
  console.log('--- Starting TiDB Catalog & Image Rehydration ---');
  console.log(`Total seed products: ${PRODUCTS.length}, Total categories: ${CATEGORIES.length}`);

  // 1. Prepare master_catalog_json
  const catalogPayload = {
    products: PRODUCTS,
    categories: CATEGORIES,
    updatedAt: new Date().toISOString()
  };
  const catalogJson = JSON.stringify(catalogPayload);

  console.log('Writing master_catalog_json to settings table in TiDB Cloud...');
  await queryDb(
    "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
    ['master_catalog_json', catalogJson, catalogJson]
  );
  console.log('master_catalog_json saved successfully!');

  // 2. Update categories table in TiDB
  console.log('Updating categories table in TiDB...');
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    await queryDb(
      "INSERT INTO categories (id, name, image, description, status) VALUES (?, ?, ?, ?, 'active') ON DUPLICATE KEY UPDATE name = VALUES(name), image = VALUES(image)",
      [cat.id, cat.name, cat.image || '', cat.description || '']
    );
  }
  console.log('Categories table updated successfully!');

  // 3. Update products table in TiDB
  console.log('Updating products table in TiDB with authentic images...');
  let updatedCount = 0;
  for (const prod of PRODUCTS) {
    const feat = prod.isFeaturedToday === true || prod.isFeaturedToday === 'true' || prod.is_featured_today === 1 || prod.is_featured_today === '1' ? 1 : 0;
    const best = prod.isBestSelling === true || prod.isBestSelling === 'true' || prod.is_best_selling === 1 || prod.is_best_selling === '1' ? 1 : 0;
    const weightsJson = JSON.stringify(prod.weights || []);

    await queryDb(
      `INSERT INTO products (id, name, category_id, category_name, badge, rating, reviews_count, image, weights_json, description, origin, shelf_life, stock, status, is_featured_today, is_best_selling)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
       ON DUPLICATE KEY UPDATE 
         name = VALUES(name),
         category_id = VALUES(category_id),
         category_name = VALUES(category_name),
         badge = VALUES(badge),
         rating = VALUES(rating),
         reviews_count = VALUES(reviews_count),
         image = VALUES(image),
         weights_json = VALUES(weights_json),
         description = VALUES(description),
         origin = VALUES(origin),
         shelf_life = VALUES(shelf_life),
         stock = VALUES(stock),
         is_featured_today = VALUES(is_featured_today),
         is_best_selling = VALUES(is_best_selling)`,
      [
        prod.id,
        prod.name,
        prod.category,
        prod.categoryName || '',
        prod.badge || '',
        prod.rating || 5,
        prod.reviews || 0,
        prod.image || '',
        weightsJson,
        prod.description || '',
        prod.origin || 'India',
        prod.shelfLife || '6 Months',
        prod.stock || 50,
        feat,
        best
      ]
    );
    updatedCount++;
  }
  console.log(`Successfully updated ${updatedCount} products in TiDB products table with exact real images!`);

  console.log('--- Database Rehydration Completed Successfully! ---');
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
