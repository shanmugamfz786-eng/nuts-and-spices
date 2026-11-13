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
  pincode_pricing: [],
  shipping_delivery_rates: [
    {
      id: 'ship_tn',
      zone_name: 'Tamil Nadu (All Districts)',
      pincode_from: '600001',
      pincode_to: '643999',
      base_weight_grams: 1000,
      base_rate: 50.00,
      additional_weight_grams: 1000,
      additional_rate: 30.00,
      free_shipping_threshold: 0.00,
      is_active: 1
    },
    {
      id: 'ship_kl',
      zone_name: 'Kerala',
      pincode_from: '670001',
      pincode_to: '695999',
      base_weight_grams: 1000,
      base_rate: 70.00,
      additional_weight_grams: 1000,
      additional_rate: 40.00,
      free_shipping_threshold: 0.00,
      is_active: 1
    },
    {
      id: 'ship_ka',
      zone_name: 'Karnataka',
      pincode_from: '560001',
      pincode_to: '591999',
      base_weight_grams: 1000,
      base_rate: 70.00,
      additional_weight_grams: 1000,
      additional_rate: 40.00,
      free_shipping_threshold: 0.00,
      is_active: 1
    },
    {
      id: 'ship_ap_tg',
      zone_name: 'Andhra Pradesh & Telangana',
      pincode_from: '500001',
      pincode_to: '535999',
      base_weight_grams: 1000,
      base_rate: 70.00,
      additional_weight_grams: 1000,
      additional_rate: 40.00,
      free_shipping_threshold: 0.00,
      is_active: 1
    },
    {
      id: 'ship_default',
      zone_name: 'Rest of India / Standard',
      pincode_from: 'DEFAULT',
      pincode_to: 'DEFAULT',
      base_weight_grams: 1000,
      base_rate: 80.00,
      additional_weight_grams: 1000,
      additional_rate: 50.00,
      free_shipping_threshold: 0.00,
      is_active: 1
    }
  ],
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
    console.error('Database query error:', error.message);
    if (process.env.NODE_ENV === 'production') {
      // In production, do NOT fall back to memoryStore: fail loudly so operators know DB is unreachable/failing
      throw error;
    }
    // Graceful fallback ONLY for local development / testing
    console.warn('⚠️ Falling back to local development in-memory store.');
    return processMemoryQuery(sql, params);
  }
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
      if (params.length > 0) {
        if (queryLower.includes('where id') || queryLower.includes('order_id')) {
          return memoryStore.orders.filter(o => 
            o.id === params[0] || o.orderId === params[0] || o.order_id === params[0] ||
            (params.length > 1 && (o.id === params[1] || o.orderId === params[1] || o.order_id === params[1]))
          );
        }
        if (queryLower.includes('where phone')) {
          return memoryStore.orders.filter(o => o.phone === params[0] || o.email === params[0] || o.email === params[1]);
        }
      }
      return memoryStore.orders;
    }

    if (queryLower.includes('from pincode_pricing')) {
      if (!memoryStore.pincode_pricing) memoryStore.pincode_pricing = [];
      if (queryLower.includes('where pincode = ?') || queryLower.includes('pincode = ?') || queryLower.includes('pincode_to')) {
        const pincode = String(params[0] || '').trim();
        const pinNum = Number(pincode);
        return memoryStore.pincode_pricing.filter(r => {
          const isActive = r.status === 'active' || !queryLower.includes("status = 'active'");
          if (!isActive) return false;
          if (r.pincode === pincode) return true;
          if (r.pincode_to && !isNaN(pinNum)) {
            const start = Number(r.pincode);
            const end = Number(r.pincode_to);
            return pinNum >= start && pinNum <= end;
          }
          return false;
        });
      }
      if (queryLower.includes('where id = ?')) {
        return memoryStore.pincode_pricing.filter(r => r.id === params[0]);
      }
      return memoryStore.pincode_pricing;
    }

    if (queryLower.includes('from shipping_delivery_rates')) {
      if (!memoryStore.shipping_delivery_rates) memoryStore.shipping_delivery_rates = [];
      if (queryLower.includes('where id = ?')) {
        return memoryStore.shipping_delivery_rates.filter(r => r.id === params[0]);
      }
      if (queryLower.includes('where is_active = 1') || queryLower.includes('is_active = 1')) {
        return memoryStore.shipping_delivery_rates.filter(r => r.is_active === 1 || r.is_active === true);
      }
      return memoryStore.shipping_delivery_rates;
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

    if (queryLower.includes('pincode_pricing')) {
      if (!memoryStore.pincode_pricing) memoryStore.pincode_pricing = [];
      const [id, productId, variantWeight, pincode, price, status] = params;
      const newRule = {
        id,
        product_id: productId,
        variant_weight: variantWeight,
        pincode,
        price: Number(price),
        status: status || 'active',
        created_at: new Date(),
        updated_at: new Date()
      };
      // Check duplicate
      const dupIdx = memoryStore.pincode_pricing.findIndex(
        r => r.product_id === productId && r.variant_weight.toLowerCase() === variantWeight.toLowerCase() && r.pincode === pincode
      );
      if (dupIdx >= 0) {
        memoryStore.pincode_pricing[dupIdx] = newRule;
      } else {
        memoryStore.pincode_pricing.push(newRule);
      }
      return { insertId: id, affectedRows: 1 };
    }

    if (queryLower.includes('shipping_delivery_rates')) {
      if (!memoryStore.shipping_delivery_rates) memoryStore.shipping_delivery_rates = [];
      const [id, zone_name, pincode_from, pincode_to, base_weight_grams, base_rate, additional_weight_grams, additional_rate, free_shipping_threshold, is_active] = params;
      const newRate = {
        id,
        zone_name,
        pincode_from: String(pincode_from || '').trim(),
        pincode_to: String(pincode_to || '').trim(),
        base_weight_grams: Number(base_weight_grams) || 1000,
        base_rate: Number(base_rate) || 50,
        additional_weight_grams: Number(additional_weight_grams) || 1000,
        additional_rate: Number(additional_rate) || 30,
        free_shipping_threshold: Number(free_shipping_threshold) || 0,
        is_active: is_active !== undefined ? Number(is_active) : 1,
        created_at: new Date(),
        updated_at: new Date()
      };
      memoryStore.shipping_delivery_rates.push(newRate);
      return { insertId: id, affectedRows: 1 };
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
      const id = params[params.length - 1];
      const [name, category, categoryName, badge, image, weightsJson, description, origin, shelfLife, stock, status] = params;
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
          try { 
            prod.weights = JSON.parse(weightsJson);
            if (prod.weights && prod.weights[0] && prod.weights[0].price) {
              prod.price = Number(prod.weights[0].price);
            }
          } catch {}
        }
      }
      return { affectedRows: prod ? 1 : 0 };
    }

    if (queryLower.includes('orders')) {
      const orderId = params[params.length - 1];
      const order = memoryStore.orders.find(o => o.id === orderId || o.orderId === orderId);
      if (order) {
        if (queryLower.includes("payment_status = 'paid'")) {
          order.payment_status = 'paid';
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
        } else if (queryLower.includes("payment_status = 'failed'")) {
          order.payment_status = 'failed';
          order.paymentStatus = 'failed';
        } else if (queryLower.includes("payment_status = 'refund_pending'")) {
          order.payment_status = 'refund_pending';
          order.paymentStatus = 'refund_pending';
        }
        if (params.length > 1 && typeof params[0] === 'string' && !params[0].startsWith('HNS-')) {
          order.status = params[0];
        }
      }
      return { affectedRows: order ? 1 : 0 };
    }

    if (queryLower.includes('pincode_pricing')) {
      if (!memoryStore.pincode_pricing) memoryStore.pincode_pricing = [];
      const id = params[params.length - 1];
      const rule = memoryStore.pincode_pricing.find(r => r.id === id);
      if (rule) {
        if (queryLower.includes('price = ?') && queryLower.includes('status = ?')) {
          rule.price = Number(params[0]);
          rule.status = params[1];
        } else if (queryLower.includes('price = ?')) {
          rule.price = Number(params[0]);
        } else if (queryLower.includes('status = ?')) {
          rule.status = params[0];
        }
        rule.updated_at = new Date();
      }
      return { affectedRows: rule ? 1 : 0 };
    }

    if (queryLower.includes('shipping_delivery_rates')) {
      if (!memoryStore.shipping_delivery_rates) memoryStore.shipping_delivery_rates = [];
      const id = params[params.length - 1];
      const rate = memoryStore.shipping_delivery_rates.find(r => r.id === id);
      if (rate) {
        if (params.length >= 8) {
          const [zone_name, pincode_from, pincode_to, base_weight_grams, base_rate, additional_weight_grams, additional_rate, free_shipping_threshold, is_active] = params;
          rate.zone_name = zone_name;
          rate.pincode_from = pincode_from;
          rate.pincode_to = pincode_to;
          rate.base_weight_grams = Number(base_weight_grams) || 1000;
          rate.base_rate = Number(base_rate) || 0;
          rate.additional_weight_grams = Number(additional_weight_grams) || 1000;
          rate.additional_rate = Number(additional_rate) || 0;
          rate.free_shipping_threshold = Number(free_shipping_threshold) || 0;
          if (is_active !== undefined) rate.is_active = Number(is_active);
        } else if (queryLower.includes('is_active = ?')) {
          rate.is_active = Number(params[0]);
        }
        rate.updated_at = new Date();
      }
      return { affectedRows: rate ? 1 : 0 };
    }
  }

  // 4. DELETE Queries
  if (queryLower.startsWith('delete')) {
    if (queryLower.includes('from shipping_delivery_rates')) {
      const id = params[0];
      if (!memoryStore.shipping_delivery_rates) memoryStore.shipping_delivery_rates = [];
      memoryStore.shipping_delivery_rates = memoryStore.shipping_delivery_rates.filter(r => r.id !== id);
      return { affectedRows: 1 };
    }
    if (queryLower.includes('from pincode_pricing')) {
      const id = params[0];
      if (!memoryStore.pincode_pricing) memoryStore.pincode_pricing = [];
      memoryStore.pincode_pricing = memoryStore.pincode_pricing.filter(r => r.id !== id);
      return { affectedRows: 1 };
    }
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

    if (queryLower.includes('from users')) {
      const id = params[0];
      memoryStore.users = memoryStore.users.filter(u => u.id !== id && u.id != id);
      return { affectedRows: 1 };
    }
  }

  return [];
}

export { memoryStore };
