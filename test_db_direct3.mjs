import mysql from 'mysql2/promise';

const run = async () => {
  try {
    const pool = mysql.createPool({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: '2ufAsPLeYmcSNkD.root',
      password: 'UABZuDoBgG5NcAcJ',
      database: 'nuts',
      ssl: { rejectUnauthorized: false }
    });
    const [rows] = await pool.execute('SELECT * FROM products WHERE name LIKE ?', ['%pattasu%']);
    console.log('TiDB Pattasu Products:', JSON.stringify(rows, null, 2));

    const [settings] = await pool.execute("SELECT setting_value FROM settings WHERE setting_key = 'master_admin_state_json'");
    if (settings && settings.length > 0) {
      const state = JSON.parse(settings[0].setting_value);
      console.log('Admin State Pattasu:', state.products ? state.products.filter(p => p.name && p.name.toLowerCase().includes('pattasu')) : null);
    }
    process.exit(0);
  } catch (e) {
    console.error('CONNECTION ERROR:', e);
    process.exit(1);
  }
};
run();
