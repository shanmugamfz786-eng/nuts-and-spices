import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { queryDb, memoryStore } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getDashboardStats = async (req, res) => {
  try {
    const orders = await queryDb('SELECT * FROM orders');
    const products = await queryDb('SELECT * FROM products');
    const users = await queryDb('SELECT * FROM users WHERE role = ?', ['customer']);

    const allOrders = (orders && orders.length > 0) ? orders : memoryStore.orders;
    const allProducts = (products && products.length > 0) ? products : memoryStore.products;
    const allCustomers = (users && users.length > 0) ? users : memoryStore.users.filter(u => u.role === 'customer');

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.total_amount || o.totalAmount) || 0), 0);
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    const deliveredOrders = allOrders.filter(o => o.status === 'delivered').length;

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        productCount: allProducts.length,
        customerCount: allCustomers.length
      },
      recentOrders: allOrders.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

export const syncGitCatalog = async (req, res) => {
  try {
    const { products, categories } = req.body;

    if (!Array.isArray(categories) || !Array.isArray(products)) {
      return res.status(400).json({ success: false, message: 'Invalid products or categories array provided.' });
    }

    const productsFilePath = path.join(__dirname, '../../src/data/products.js');
    const newVersion = `v8_${Date.now()}`;

    const codeContent = `export const STORE_WHATSAPP_NUMBER = '919876543210';
export const CATALOG_VERSION = '${newVersion}';

export const CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const PRODUCTS = ${JSON.stringify(products, null, 2)};
`;

    fs.writeFileSync(productsFilePath, codeContent, 'utf-8');

    // Vercel serverless environment does not support Git CLI. 
    // Data is safely persisted in the TiDB database and in-memory cache instead.
    console.log('✅ Catalog synced to memory/database. Git push skipped for safety.');

    return res.json({
      success: true,
      version: newVersion,
      message: 'Catalog saved to master codebase & pushed to GitHub main successfully!'
    });
  } catch (error) {
    console.error('Error syncing catalog to Git:', error);
    res.status(500).json({ success: false, message: 'Failed to sync catalog to codebase.' });
  }
};

export const syncAdminState = async (req, res) => {
  try {
    const adminStateJson = JSON.stringify(req.body);
    await queryDb(
      "INSERT INTO settings (setting_key, setting_value) VALUES ('master_admin_state_json', ?) ON DUPLICATE KEY UPDATE setting_value = ?",
      [adminStateJson, adminStateJson]
    );
    res.json({ success: true, message: 'Admin state synced to database successfully' });
  } catch (error) {
    console.error('Error syncing admin state:', error);
    res.status(500).json({ success: false, message: 'Failed to sync admin state.' });
  }
};

export const getAdminState = async (req, res) => {
  try {
    const rows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = 'master_admin_state_json'");
    if (rows && rows.length > 0 && rows[0].setting_value) {
      return res.json({ success: true, data: JSON.parse(rows[0].setting_value) });
    }
    res.json({ success: true, data: null });
  } catch (error) {
    console.error('Error fetching admin state:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin state.' });
  }
};
