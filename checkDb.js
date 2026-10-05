import { queryDb } from './server/config/db.js';

async function check() {
  const rows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = 'master_catalog_json'");
  const data = JSON.parse(rows[0].setting_value);
  console.log('Products in DB:', data.products.length);
  process.exit(0);
}

check();
