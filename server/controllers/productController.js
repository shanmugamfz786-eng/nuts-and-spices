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
      const catalogStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_catalog_json']);
      if (catalogStateRows && catalogStateRows.length > 0 && catalogStateRows[0].setting_value) {
         const parsedCatalog = JSON.parse(catalogStateRows[0].setting_value);
         if (parsedCatalog && Array.isArray(parsedCatalog.products) && parsedCatalog.products.length > 0) {
            const catalogMap = new Map(parsedCatalog.products.map(p => [p.id, p]));
            // Merge changes onto existing products
            products = products.map(p => {
              if (catalogMap.has(p.id)) {
                return { ...p, ...catalogMap.get(p.id) };
              }
              return p;
            });
            // And append any newly created products
            for (const p of parsedCatalog.products) {
              if (!products.some(prod => prod.id === p.id)) {
                products.push(p);
              }
            }
         }
      }

      const adminStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_admin_state_json']);
      if (adminStateRows && adminStateRows.length > 0 && adminStateRows[0].setting_value) {
         const parsedState = JSON.parse(adminStateRows[0].setting_value);
         if (parsedState && Array.isArray(parsedState.products) && parsedState.products.length > 0) {
            const stateMap = new Map(parsedState.products.map(p => [p.id, p]));
            products = products.map(p => {
              if (stateMap.has(p.id)) {
                return { ...p, ...stateMap.get(p.id) };
              }
              return p;
            });
            for (const p of parsedState.products) {
              if (!products.some(prod => prod.id === p.id)) {
                products.push(p);
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

    const mappedFiltered = filtered.map(p => {
      let weights = p.weights;
      if (!weights && p.weights_json) {
        try {
          weights = typeof p.weights_json === 'string' ? JSON.parse(p.weights_json) : p.weights_json;
        } catch(e) {}
      }
      const isFeatured = p.isFeaturedToday === true || p.isFeaturedToday === 'true' || p.is_featured_today === 1 || p.is_featured_today === '1';
      const isBest = p.isBestSelling === true || p.isBestSelling === 'true' || p.is_best_selling === 1 || p.is_best_selling === '1';
      return {
        ...p,
        weights: Array.isArray(weights) ? weights : p.weights,
        isFeaturedToday: Boolean(isFeatured),
        is_featured_today: isFeatured ? 1 : 0,
        isBestSelling: Boolean(isBest),
        is_best_selling: isBest ? 1 : 0
      };
    });

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
    try {
      const catalogStateRows = await queryDb("SELECT setting_value FROM settings WHERE setting_key = ?", ['master_catalog_json']);
      if (catalogStateRows && catalogStateRows.length > 0 && catalogStateRows[0].setting_value) {
        const parsedCatalog = JSON.parse(catalogStateRows[0].setting_value);
        if (parsedCatalog && Array.isArray(parsedCatalog.products)) {
          const catalogP = parsedCatalog.products.find(p => p.id === id);
          if (catalogP) {
            product = { ...(product || {}), ...catalogP };
          }
        }
      }
    } catch(e) {}

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (!product.weights && product.weights_json) {
      try {
        product.weights = typeof product.weights_json === 'string' ? JSON.parse(product.weights_json) : product.weights_json;
      } catch(e) {}
    }

    const isFeatured = product.isFeaturedToday === true || product.isFeaturedToday === 'true' || product.is_featured_today === 1 || product.is_featured_today === '1';
    const isBest = product.isBestSelling === true || product.isBestSelling === 'true' || product.is_best_selling === 1 || product.is_best_selling === '1';
    product.isFeaturedToday = Boolean(isFeatured);
    product.is_featured_today = isFeatured ? 1 : 0;
    product.isBestSelling = Boolean(isBest);
    product.is_best_selling = isBest ? 1 : 0;

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
    const { 
      name, 
      category, 
      categoryName, 
      badge, 
      price, 
      image, 
      description, 
      origin, 
      shelfLife, 
      stock, 
      status, 
      active, 
      weights, 
      isFeaturedToday, 
      is_featured_today, 
      isBestSelling, 
      is_best_selling 
    } = req.body;

    const weightsJson = weights ? JSON.stringify(weights) : (price ? JSON.stringify([{ label: 'Standard', price: Number(price) }]) : null);
    const activeVal = status ? status : ((active === true || active === 'true' || active === 'Active') ? 'Active' : 'Inactive');

    const rawFeat = isFeaturedToday !== undefined ? isFeaturedToday : is_featured_today;
    const rawBest = isBestSelling !== undefined ? isBestSelling : is_best_selling;

    const toSql = (v) => v !== undefined ? v : null;

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
      [
        toSql(name), 
        toSql(category), 
        toSql(categoryName), 
        toSql(badge), 
        toSql(image), 
        toSql(weightsJson), 
        toSql(description), 
        toSql(origin), 
        toSql(shelfLife), 
        stock !== undefined ? Number(stock) : null, 
        toSql(activeVal), 
        rawFeat !== undefined ? ((rawFeat === true || rawFeat === 'true' || rawFeat === 1 || rawFeat === '1') ? 1 : 0) : null, 
        rawBest !== undefined ? ((rawBest === true || rawBest === 'true' || rawBest === 1 || rawBest === '1') ? 1 : 0) : null, 
        id
      ]
    );

    const curProds = inMemoryCatalog.products && inMemoryCatalog.products.length > 0 ? inMemoryCatalog.products : PRODUCTS;
    const updatedProds = curProds.map(p => {
      if (p.id === id) {
        const newStatus = activeVal || p.status;
        const featVal = rawFeat !== undefined 
          ? (rawFeat === true || rawFeat === 'true' || rawFeat === 1 || rawFeat === '1')
          : (p.isFeaturedToday === true || p.isFeaturedToday === 'true' || p.is_featured_today === 1 || p.is_featured_today === '1');
        const bestVal = rawBest !== undefined 
          ? (rawBest === true || rawBest === 'true' || rawBest === 1 || rawBest === '1')
          : (p.isBestSelling === true || p.isBestSelling === 'true' || p.is_best_selling === 1 || p.is_best_selling === '1');

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
          ...(price !== undefined && !weights && { price: Number(price) }),
          isFeaturedToday: Boolean(featVal),
          is_featured_today: featVal ? 1 : 0,
          isBestSelling: Boolean(bestVal),
          is_best_selling: bestVal ? 1 : 0,
          status: newStatus,
          active: newStatus === 'Active'
        };
      }
      return p;
    });

    // Update in-memory and sync to database catalog
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
