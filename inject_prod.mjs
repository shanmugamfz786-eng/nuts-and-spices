import { queryDb } from './server/config/db.js';

const run = async () => {
  try {
    const weightsJson = JSON.stringify([{ label: '250g', price: 500, originalPrice: 500 }]);
    await queryDb(
      `INSERT INTO products (id, name, category_id, category_name, badge, image, weights_json, stock, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE weights_json = ?`,
      ['test-prod', 'Test Product', 'nuts', 'Nuts', 'New', '', weightsJson, 100, 'Active', weightsJson]
    );
    console.log('Product injected');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
run();
