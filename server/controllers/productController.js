import { queryDb, memoryStore } from '../config/db.js';
import { CATEGORIES, PRODUCTS } from '../../src/data/products.js';
import { syncServerCatalog, inMemoryCatalog } from '../index.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let products = await queryDb('SELECT * FROM products');

    if (!products || products.length === 0) {
      products = memoryStore.products.length > 0 ? memoryStore.products : PRODUCTS;
    }

    try {
      const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
      if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
         const parsedState = JSON.parse(adminStateRows[0].setting_value);
         if (parsedState && parsedState.products && parsedState.products.length > 0) {
              const existingIds = new Set(products.map(p => p.id));
              for (const p of parsedState.products) {
                if (!existingIds.has(p.id)) {
                  products.push(p);
                  existingIds.add(p.id);
                }
              }
           }
      }
    } catch(e) {}

    let filtered = products;

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category || p.category_id === category);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    const mappedFiltered = filtered.map(p => ({
      ...p,
      isFeaturedToday: p.is_featured_today === 1 ? true : (p.is_featured_today === 0 ? false : (p.isFeaturedToday || false)),
      isBestSelling: p.is_best_selling === 1 ? true : (p.is_best_selling === 0 ? false : (p.isBestSelling || false))
    }));

    res.json({
      success: true,
      count: mappedFiltered.length,
      products: mappedFiltered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbProds = await queryDb('SELECT * FROM products WHERE id = ?', [id]);
    
    let product = dbProds && dbProds.length > 0 ? dbProds[0] : null;
    if (!product) {
      product = PRODUCTS.find(p => p.id === id);
    }
    if (!product) {
       try {
         const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
         if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
            const parsedState = JSON.parse(adminStateRows[0].setting_value);
            if (parsedState && parsedState.products && parsedState.products.length > 0) {
               product = parsedState.products.find(p => p.id === id);
            }
         }
       } catch(e) {}
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    product.isFeaturedToday = product.is_featured_today === 1 ? true : (product.is_featured_today === 0 ? false : (product.isFeaturedToday || false));
    product.isBestSelling = product.is_best_selling === 1 ? true : (product.is_best_selling === 0 ? false : (product.isBestSelling || false));

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product.' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    let categories = await queryDb('SELECT * FROM categories');
    if (!categories || categories.length === 0) {
      categories = CATEGORIES;
    }
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { id, name, category, categoryName, badge, price, image, weights, description, origin, shelfLife, stock, status, isFeaturedToday, isBestSelling } = req.body;
    
    const newId = id || req.body.id || `prod_${Date.now()}`;
    const parsedWeights = Array.isArray(weights) && weights.length > 0
      ? weights
      : [{ label: 'Standard', price: Number(price) || 290, originalPrice: Math.round((Number(price) || 290) * 1.2) }];
    const weightsJson = JSON.stringify(parsedWeights);
    const prodStatus = status || 'Active';

    await queryDb(
      `INSERT INTO products (id, name, category_id, category_name, badge, image, weights_json, description, origin, shelf_life, stock, status, is_featured_today, is_best_selling)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = ?, category_id = ?, category_name = ?, badge = ?, image = ?, weights_json = ?, description = ?, origin = ?, shelf_life = ?, stock = ?, status = ?, is_featured_today = ?, is_best_selling = ?`,
      [
        newId, name, category, categoryName || category, badge || 'Fresh', image, weightsJson, description || '', origin || 'India', shelfLife || '6 Months', Number(stock) || 100, prodStatus, isFeaturedToday ? 1 : 0, isBestSelling ? 1 : 0,
        name, category, categoryName || category, badge || 'Fresh', image, weightsJson, description || '', origin || 'India', shelfLife || '6 Months', Number(stock) || 100, prodStatus, isFeaturedToday ? 1 : 0, isBestSelling ? 1 : 0
      ]
    );

    const createdProduct = {
      id: newId,
      name,
      category,
      categoryName: categoryName || category,
      badge: badge || 'Fresh',
      image,
      price: parsedWeights[0].price,
      weights: parsedWeights,
      description: description || '',
      origin: origin || 'India',
      shelfLife: shelfLife || '6 Months',
      stock: Number(stock) || 100,
      status: prodStatus,
      active: prodStatus === 'Active',
      isFeaturedToday: !!isFeaturedToday,
      isBestSelling: !!isBestSelling
    };

    const curProds = inMemoryCatalog.products || PRODUCTS;
    const existingIdx = curProds.findIndex(p => p.id === newId);
    let updatedProds = [];
    if (existingIdx >= 0) {
      updatedProds = curProds.map((p, i) => i === existingIdx ? { ...p, ...createdProduct } : p);
    } else {
      updatedProds = [createdProduct, ...curProds];
    }
    await syncServerCatalog(updatedProds, inMemoryCatalog.categories);

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: createdProduct
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, categoryName, badge, price, image, description, origin, shelfLife, stock, status, active, weights, isFeaturedToday, isBestSelling } = req.body;

    const weightsJson = weights ? JSON.stringify(weights) : (price ? JSON.stringify([{ label: 'Standard', price: Number(price) }]) : null);
    const activeVal = status ? status : ((active === true || active === 'true' || active === 'Active') ? 'Active' : 'Inactive');

    await queryDb(
      `UPDATE products SET 
        name = COALESCE(?, name), 
        category_id = COALESCE(?, category_id), 
        category_name = COALESCE(?, category_name), 
        badge = COALESCE(?, badge), 
        image = COALESCE(?, image), 
        weights_json = COALESCE(?, weights_json), 
        description = COALESCE(?, description), 
        origin = COALESCE(?, origin), 
        shelf_life = COALESCE(?, shelf_life), 
        stock = COALESCE(?, stock), 
        status = COALESCE(?, status),
        is_featured_today = COALESCE(?, is_featured_today),
        is_best_selling = COALESCE(?, is_best_selling)
       WHERE id = ?`,
      [name, category, categoryName, badge, image, weightsJson, description, origin, shelfLife, stock, activeVal, isFeaturedToday !== undefined ? (isFeaturedToday ? 1 : 0) : null, isBestSelling !== undefined ? (isBestSelling ? 1 : 0) : null, id]
    );

    const curProds = inMemoryCatalog.products || PRODUCTS;
    const updatedProds = curProds.map(p => {
      if (p.id === id) {
        const newStatus = activeVal || p.status;
        return {
          ...p,
          ...(name && { name }),
          ...(category && { category }),
          ...(categoryName && { categoryName }),
          ...(badge && { badge }),
          ...(image && { image }),
          ...(description && { description }),
          ...(origin && { origin }),
          ...(shelfLife && { shelfLife }),
          ...(stock !== undefined && { stock: Number(stock) }),
          ...(weights && { weights, price: weights[0] ? weights[0].price : p.price }),
          ...(isFeaturedToday !== undefined && { isFeaturedToday }),
          ...(isBestSelling !== undefined && { isBestSelling }),
          status: newStatus,
          active: newStatus === 'Active'
        };
      }
      return p;
    });
    await syncServerCatalog(updatedProds, inMemoryCatalog.categories);

    res.json({
      success: true,
      message: 'Product updated successfully!'
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product in database.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await queryDb('DELETE FROM products WHERE id = ?', [id]);
    
    const curProds = inMemoryCatalog.products || PRODUCTS;
    const updatedProds = curProds.filter(p => p.id !== id);
    await syncServerCatalog(updatedProds, inMemoryCatalog.categories);

    res.json({
      success: true,
      message: 'Product deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};
