import { getPool } from './server/config/db.js';

async function run() {
  try {
    const pool = getPool();
    console.log('Adding is_featured_today...');
    try { await pool.query('ALTER TABLE products ADD COLUMN is_featured_today TINYINT(1) DEFAULT 0'); } catch(e) {}
    console.log('Adding is_best_selling...');
    try { await pool.query('ALTER TABLE products ADD COLUMN is_best_selling TINYINT(1) DEFAULT 0'); } catch(e) {}
    console.log('Done!');
    process.exit(0);
  } catch(e) {
    console.log(e);
    process.exit(1);
  }
}
run();
