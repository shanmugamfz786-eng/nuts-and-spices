import { queryDb } from './server/config/db.js';

const run = async () => {
  try {
    const prods = await queryDb('SELECT id, name, active, status FROM products');
    console.log('TiDB Products Count:', prods.length);
    console.log('Pattasu in products table:', prods.find(p => p.name && p.name.toLowerCase().includes('pattasu')));

    const settings = await queryDb("SELECT setting_value FROM settings WHERE setting_key = 'master_admin_state_json'");
    if (settings && settings.length > 0) {
      const state = JSON.parse(settings[0].setting_value);
      console.log('Admin State Products Count:', state.products ? state.products.length : 0);
      console.log('Pattasu in admin state:', state.products ? state.products.find(p => p.name && p.name.toLowerCase().includes('pattasu')) : null);
    } else {
      console.log('No master_admin_state_json found.');
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
run();
