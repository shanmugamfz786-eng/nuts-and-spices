import bcrypt from 'bcryptjs';
import { getPool, memoryStore } from '../config/db.js';
import { CATEGORIES, PRODUCTS } from '../../src/data/products.js';

export async function initializeDatabase() {
  console.log('🚀 Initializing TiDB / MySQL database schema & seed data...');

  const schemaStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer', 'admin') DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      image TEXT,
      description TEXT,
      status VARCHAR(20) DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      category_id VARCHAR(50),
      category_name VARCHAR(100),
      badge VARCHAR(50),
      rating DECIMAL(3,2) DEFAULT 5.0,
      reviews_count INT DEFAULT 0,
      image TEXT,
      weights_json JSON,
      description TEXT,
      origin VARCHAR(100),
      shelf_life VARCHAR(50),
      stock INT DEFAULT 100,
      status VARCHAR(20) DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL,
      customer_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(100),
      address TEXT NOT NULL,
      city VARCHAR(50) NOT NULL,
      state VARCHAR(50),
      pincode VARCHAR(10) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      delivery_charge DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      items_json JSON NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(50) PRIMARY KEY,
      product_id VARCHAR(50) NOT NULL,
      user_name VARCHAR(100) NOT NULL,
      rating INT DEFAULT 5,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS coupons (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      discount_percent INT NOT NULL,
      min_order_amount DECIMAL(10,2) DEFAULT 0,
      expiry_date DATE,
      active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS settings (
      setting_key VARCHAR(50) PRIMARY KEY,
      setting_value TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  ];

  // Populate memory store seed data first
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn("⚠️ INITIAL_ADMIN_PASSWORD not set in environment. Skipping admin seed.");
  }
  const adminHashedPassword = adminPassword ? await bcrypt.hash(adminPassword, 10) : null;
  const sampleCustomerHashed = await bcrypt.hash('123456', 10);

  const defaultAdmin = {
    id: 'usr_admin',
    name: 'Gourmet Admin',
    phone: '9876543210',
    email: 'admin@nutsandspices.in',
    password: adminHashedPassword,
    role: 'admin',
    createdAt: new Date()
  };

  const sampleCustomer = {
    id: 'usr_customer_1',
    name: 'Karthik Raja',
    phone: '9876543210',
    email: 'karthik@nutsandspices.in',
    password: sampleCustomerHashed,
    role: 'customer',
    createdAt: new Date()
  };

  memoryStore.users = [defaultAdmin, sampleCustomer];
  memoryStore.categories = CATEGORIES;
  memoryStore.products = PRODUCTS;
  memoryStore.orders = [
    {
      id: 'NS-98124',
      orderId: 'NS-98124',
      customerName: 'Karthik Raja',
      phone: '9876543210',
      email: 'karthik@nutsandspices.in',
      address: 'No 45, Anna Salai, T. Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      subtotal: 890,
      deliveryCharge: 50,
      totalAmount: 940,
      status: 'confirmed',
      itemsJson: JSON.stringify([
        { cartItemId: 'vp-01-250g Jar', name: 'Viral Saffron Cardamom Wellness Elixir', weight: '250g Jar', price: 490, quantity: 1 },
        { cartItemId: 'ndf-01-250g', name: 'California Jumbo Almonds (Badam)', weight: '250g', price: 340, quantity: 1 }
      ]),
      notes: 'Please pack in eco-friendly gift wrap.',
      createdAt: new Date()
    }
  ];

  try {
    const pool = getPool();
    for (const sql of schemaStatements) {
      await pool.query(sql);
    }
    console.log('✅ TiDB / MySQL database tables created successfully!');

    // Seed Admin User in MySQL/TiDB
    if (adminHashedPassword) {
      const [existingAdmin] = await pool.query('SELECT * FROM users WHERE email = ?', ['admin@nutsandspices.in']);
      if (existingAdmin.length === 0) {
        await pool.query(
          'INSERT INTO users (id, name, phone, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
          ['usr_admin', 'Gourmet Admin', '9876543210', 'admin@nutsandspices.in', adminHashedPassword, 'admin']
        );
        console.log('👑 Admin user seeded from environment configuration.');
      }
    }

    // Seed Categories
    for (const cat of CATEGORIES) {
      await pool.query(
        'INSERT IGNORE INTO categories (id, name, image) VALUES (?, ?, ?)',
        [cat.id, cat.name, cat.image]
      );
    }

    // Seed Products
    for (const prod of PRODUCTS) {
      await pool.query(
        `INSERT IGNORE INTO products 
        (id, name, category_id, category_name, badge, rating, reviews_count, image, weights_json, description, origin, shelf_life, stock) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.id,
          prod.name,
          prod.category,
          prod.categoryName,
          prod.badge || '',
          prod.rating || 5.0,
          prod.reviews || 0,
          prod.image,
          JSON.stringify(prod.weights),
          prod.description,
          prod.origin || 'India',
          prod.shelfLife || '6 Months',
          100
        ]
      );
    }

    console.log('🎉 TiDB / MySQL Database initial seeding completed!');
  } catch (err) {
    console.error('❌ Database init error:', err);
    console.log('ℹ️ Running backend in high-speed Memory Mode for fast execution.');
  }
}

// Run directly if called as a script
if (process.argv && process.argv[1] && process.argv[1].includes('initDb.js')) {
  initializeDatabase().then(() => process.exit(0));
}
