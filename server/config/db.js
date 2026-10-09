import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool = null;

export const getPool = () => {
  if (!pool) {
    const host = process.env.DB_HOST;
    const isTiDB = host && host.includes('tidbcloud.com');
    const config = {
      host: host,
      port: Number(process.env.DB_PORT) || (isTiDB ? 4000 : 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000
    };

    if (process.env.DB_SSL === 'true' || isTiDB) {
      config.ssl = { rejectUnauthorized: false };
    }

    pool = mysql.createPool(config);
  }
  return pool;
};

import { CATEGORIES, PRODUCTS } from '../../src/data/products.js';

// Fallback memory store when MySQL/TiDB server is not running locally
const memoryStore = {
  users: [],
  categories: [...CATEGORIES],
  products: [...PRODUCTS],
  orders: [],
  reviews: [],
  coupons: [],
  settings: {
    whatsapp_number: process.env.STORE_WHATSAPP_NUMBER || '919655298540',
    delivery_charge: '50'
  }
};

export const queryDb = async (sql, params = []) => {
  try {
    const dbPool = getPool();
    const [rows] = await dbPool.execute(sql, params);
    return rows;
  } catch (error) {
    console.warn('⚠️ TiDB/MySQL database connection note:', error.message);
    console.log('🔄 Executing in-memory fallback query processor...');
    return processMemoryQuery(sql, params);
  };
};

function processMemoryQuery(sql, params) {
  const queryLower = sql.trim().toLowerCase();

  // 1. SELECT Queries
  if (queryLower.startsWith('select')) {
    if (queryLower.includes('from settings')) {
      if (params.length > 0) {
        const val = memoryStore.settings[params[0]];
        return val !== undefined ? [{ setting_key: params[0], setting_value: val }] : [];
      }
      return Object.entries(memoryStore.settings).map(([key, value]) => ({ setting_key: key, setting_value: value }));
    }

    if (queryLower.includes('from categories')) {
      if (queryLower.includes('where id') && params.length > 0) {
        return memoryStore.categories.filter(c => c.id === params[0]);
      }
      return memoryStore.categories;
    }

    if (queryLower.includes('from products')) {
      if (queryLower.includes('where category') && params.length > 0) {
        return memoryStore.products.filter(p => p.category === params[0] || p.category_id === params[0]);
      }
      if (queryLower.includes('where id') && params.length > 0) {
        return memoryStore.products.filter(p => p.id === params[0]);
      }
      return memoryStore.products;
    }

    if (queryLower.includes('from users')) {
      if (params.length > 0) {
        return memoryStore.users.filter(u => u.email === params[0] || u.phone === params[0] || u.id === params[0]);
      }
      return memoryStore.users;
    }

    if (queryLower.includes('from orders')) {
      if (queryLower.includes('where id') && params.length > 0) {
        return memoryStore.orders.filter(o => o.id === params[0] || o.orderId === params[0]);
      }
      return memoryStore.orders;
    }
  }

  // 2. INSERT / REPLACE Queries
  if (queryLower.startsWith('insert into') || queryLower.startsWith('replace into')) {
    if (queryLower.includes('settings')) {
      if (params.length >= 2) {
        memoryStore.settings[params[0]] = params[1];
      }
      return { affectedRows: 1 };
    }

    if (queryLower.includes('categories')) {
      const [id, name, image, description] = params;
      const existingIdx = memoryStore.categories.findIndex(c => c.id === id);
      const catObj = { id, name, image, description: description || '', icon: '🌰' };
      if (existingIdx >= 0) {
        memoryStore.categories[existingIdx] = catObj;
      } else {
        memoryStore.categories.push(catObj);
      }
      return { insertId: id, affectedRows: 1 };
    }

    if (queryLower.includes('products')) {
      const [id, name, category, categoryName, badge, image, weightsJson, description, origin, shelfLife, stock] = params;
      let weights = [];
      try { weights = JSON.parse(weightsJson); } catch {}
      const prodObj = {
        id, name, category, categoryName: categoryName || category, badge, image,
        weights: weights.length > 0 ? weights : [{ label: 'Standard', price: 290 }],
        description, origin: origin || 'India', shelfLife: shelfLife || '6 Months',
        stock: Number(stock) || 100, status: 'Active', active: true
      };
      const existingIdx = memoryStore.products.findIndex(p => p.id === id);
      if (existingIdx >= 0) {
        memoryStore.products[existingIdx] = prodObj;
      } else {
        memoryStore.products.unshift(prodObj);
      }
      return { insertId: id, affectedRows: 1 };
    }

    if (queryLower.includes('users')) {
      const newUser = { id: `usr_${Date.now()}`, name: params[0], phone: params[1], email: params[2], password: params[3], role: params[4] || 'customer', createdAt: new Date() };
      memoryStore.users.push(newUser);
      return { insertId: newUser.id, affectedRows: 1 };
    }

    if (queryLower.includes('orders')) {
      const newOrder = {
        id: params[0], orderId: params[0], customerName: params[1], phone: params[2], email: params[3],
        address: params[4], city: params[5], state: params[6], pincode: params[7], subtotal: params[8],
        deliveryCharge: params[9], totalAmount: params[10], status: params[11] || 'pending', itemsJson: params[12], notes: params[13], createdAt: new Date()
      };
      memoryStore.orders.unshift(newOrder);
      return { insertId: newOrder.id, affectedRows: 1 };
    }
  }

  // 3. UPDATE Queries
  if (queryLower.startsWith('update')) {
    if (queryLower.includes('settings')) {
      if (params.length >= 2) {
        memoryStore.settings[params[0]] = params[1];
      }
      return { affectedRows: 1 };
    }

    if (queryLower.includes('categories')) {
      const [name, image, description, id] = params;
      const cat = memoryStore.categories.find(c => c.id === id);
      if (cat) {
        if (name) cat.name = name;
        if (image) cat.image = image;
        if (description) cat.description = description;
      }
      return { affectedRows: cat ? 1 : 0 };
    }

    if (queryLower.includes('products')) {
      const [name, category, categoryName, badge, image, weightsJson, description, origin, shelfLife, stock, status, id] = params;
      const prod = memoryStore.products.find(p => p.id === id);
      if (prod) {
        if (name) prod.name = name;
        if (category) prod.category = category;
        if (categoryName) prod.categoryName = categoryName;
        if (badge) prod.badge = badge;
        if (image) prod.image = image;
        if (description) prod.description = description;
        if (origin) prod.origin = origin;
        if (shelfLife) prod.shelfLife = shelfLife;
        if (stock !== undefined && stock !== null) prod.stock = Number(stock);
        if (status) {
          prod.status = status === 'active' ? 'Active' : (status === 'inactive' ? 'Inactive' : status);
          prod.active = prod.status === 'Active';
        }
        if (weightsJson) {
          try { prod.weights = JSON.parse(weightsJson); } catch {}
        }
      }
      return { affectedRows: prod ? 1 : 0 };
    }

    if (queryLower.includes('orders')) {
      const [status, orderId] = params;
      const order = memoryStore.orders.find(o => o.id === orderId || o.orderId === orderId);
      if (order) order.status = status;
      return { affectedRows: order ? 1 : 0 };
    }
  }

  // 4. DELETE Queries
  if (queryLower.startsWith('delete')) {
    if (queryLower.includes('from categories')) {
      const id = params[0];
      memoryStore.categories = memoryStore.categories.filter(c => c.id !== id);
      return { affectedRows: 1 };
    }

    if (queryLower.includes('from products')) {
      const id = params[0];
      memoryStore.products = memoryStore.products.filter(p => p.id !== id);
      return { affectedRows: 1 };
    }
  }

  return [];
}

export { memoryStore };
