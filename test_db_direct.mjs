import { getPool } from './server/config/db.js';

const run = async () => {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT id, name, active, status FROM products');
    console.log('TiDB Products Count:', rows.length);
    console.log('Pattasu in products table:', rows.find(p => p.name && p.name.toLowerCase().includes('pattasu')));
    process.exit(0);
  } catch (e) {
    console.error('CONNECTION ERROR:', e);
    process.exit(1);
  }
};
run();
