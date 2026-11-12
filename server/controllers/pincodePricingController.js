import crypto from 'crypto';
import { queryDb, memoryStore } from '../config/db.js';
import { PRODUCTS } from '../../src/data/products.js';

/**
 * Normalizes weight label for consistent matching (e.g. "250g", " 250G ", "250g Jar")
 */
export const normalizeWeight = (w) => String(w || '').trim().toLowerCase();

/**
 * Fetch combined product catalog from DB and fallback
 */
async function getCatalogProducts() {
  let dbProducts = [];
  try {
    dbProducts = await queryDb('SELECT * FROM products');
  } catch (err) {
    dbProducts = [];
  }
  if (!dbProducts || dbProducts.length === 0) {
    dbProducts = memoryStore.products?.length > 0 ? [...memoryStore.products] : [...PRODUCTS];
  }
  return dbProducts;
}

/**
 * 1. Admin: Create a new pincode pricing rule
 */
export const createPincodePricing = async (req, res) => {
  try {
    const { productId, variantWeight, pincode, pincodeTo, price, adjustmentType = 'fixed', status = 'active' } = req.body;

    if (!productId || !variantWeight || !pincode || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, Variant/Weight, 6-digit Pincode, and Price are required.'
      });
    }

    const cleanPincode = String(pincode).trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).json({
        success: false,
        message: 'Starting pincode must be exactly 6 digits.'
      });
    }

    let cleanPincodeTo = null;
    if (pincodeTo && String(pincodeTo).trim()) {
      cleanPincodeTo = String(pincodeTo).trim();
      if (!/^\d{6}$/.test(cleanPincodeTo)) {
        return res.status(400).json({
          success: false,
          message: 'Ending pincode must be exactly 6 digits.'
        });
      }
      if (Number(cleanPincode) > Number(cleanPincodeTo)) {
        return res.status(400).json({
          success: false,
          message: 'Starting pincode cannot be greater than ending pincode.'
        });
      }
      if (cleanPincode === cleanPincodeTo) {
        cleanPincodeTo = null; // Normalize single pincode
      }
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price/Increase amount must be a positive number greater than 0.'
      });
    }

    let cleanVariant = String(variantWeight).trim();
    let product;
    const isAllProducts = productId === 'ALL' || productId === 'ALL_PRODUCTS';
    const cleanProductId = isAllProducts ? 'ALL' : productId;
    let cleanAdjustmentType = adjustmentType || (isAllProducts ? 'flat_increase' : 'fixed');

    if (isAllProducts) {
      product = {
        id: 'ALL',
        name: 'All Products (Storewide)',
        image: '/logo.jpg',
        categoryName: 'Storewide'
      };
      cleanVariant = 'ALL';
    } else {
      // Verify product exists in catalog
      const catalog = await getCatalogProducts();
      product = catalog.find(p => p.id === cleanProductId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${cleanProductId}' was not found in catalog.`
        });
      }

      // Verify variant exists on the product (if product defines weights)
      let productWeights = product.weights || product.weights_json;
      if (typeof productWeights === 'string') {
        try { productWeights = JSON.parse(productWeights); } catch { productWeights = []; }
      }
      if (Array.isArray(productWeights) && productWeights.length > 0) {
        const matchVariant = productWeights.find(w => normalizeWeight(w.label) === normalizeWeight(cleanVariant));
        if (!matchVariant) {
          return res.status(400).json({
            success: false,
            message: `Variant '${cleanVariant}' is not valid for product '${product.name}'. Available: ${productWeights.map(w => w.label).join(', ')}`
          });
        }
      }
    }

    // Check duplicate rule
    let existing;
    if (cleanPincodeTo) {
      existing = await queryDb(
        'SELECT id FROM pincode_pricing WHERE product_id = ? AND LOWER(variant_weight) = LOWER(?) AND pincode = ? AND pincode_to = ? LIMIT 1',
        [cleanProductId, cleanVariant, cleanPincode, cleanPincodeTo]
      );
    } else {
      existing = await queryDb(
        'SELECT id FROM pincode_pricing WHERE product_id = ? AND LOWER(variant_weight) = LOWER(?) AND pincode = ? AND (pincode_to IS NULL OR pincode_to = "" OR pincode_to = pincode) LIMIT 1',
        [cleanProductId, cleanVariant, cleanPincode]
      );
    }

    if (existing && existing.length > 0) {
      const rangeLabel = cleanPincodeTo ? `${cleanPincode} to ${cleanPincodeTo}` : cleanPincode;
      return res.status(409).json({
        success: false,
        message: `A pricing rule for '${product.name}', variant '${cleanVariant}', and pincode (${rangeLabel}) already exists. Please edit the existing rule instead.`
      });
    }

    const ruleId = `pcp_${crypto.randomUUID()}`;
    const cleanStatus = status === 'inactive' ? 'inactive' : 'active';

    await queryDb(
      'INSERT INTO pincode_pricing (id, product_id, variant_weight, pincode, pincode_to, price, adjustment_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [ruleId, cleanProductId, cleanVariant, cleanPincode, cleanPincodeTo, numPrice, cleanAdjustmentType, cleanStatus]
    );

    const newRule = {
      id: ruleId,
      product_id: cleanProductId,
      productName: product.name,
      productImage: product.image,
      variant_weight: cleanVariant,
      pincode: cleanPincode,
      pincodeTo: cleanPincodeTo,
      price: numPrice,
      adjustmentType: cleanAdjustmentType,
      status: cleanStatus,
      created_at: new Date(),
      updated_at: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Pincode pricing rule created successfully!',
      rule: newRule
    });
  } catch (error) {
    console.error('Create Pincode Pricing Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating pricing rule.'
    });
  }
};

/**
 * 2. Admin: Get all pincode pricing rules with optional search & filter
 */
export const getAllPincodePricings = async (req, res) => {
  try {
    const { search, productId, pincode, status } = req.query;

    let query = 'SELECT * FROM pincode_pricing';
    const conditions = [];
    const params = [];

    if (productId) {
      conditions.push('product_id = ?');
      params.push(productId);
    }

    if (pincode) {
      conditions.push('pincode = ?');
      params.push(String(pincode).trim());
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY created_at DESC';

    let rows = await queryDb(query, params);
    if (!Array.isArray(rows)) rows = [];

    // Attach product name & image to each rule for admin display
    const catalog = await getCatalogProducts();
    const productMap = new Map(catalog.map(p => [p.id, p]));

    let rules = rows.map(r => {
      const isAll = (r.product_id || r.productId) === 'ALL';
      const prod = productMap.get(r.product_id) || productMap.get(r.productId);
      return {
        id: r.id,
        productId: r.product_id || r.productId,
        productName: isAll ? '✨ ALL PRODUCTS (Storewide)' : (prod ? prod.name : (r.product_name || 'Unknown Product')),
        productImage: isAll ? '/logo.jpg' : (prod ? prod.image : ''),
        categoryName: isAll ? 'Storewide' : (prod ? (prod.categoryName || prod.category) : ''),
        variantWeight: r.variant_weight || r.variantWeight,
        pincode: r.pincode,
        pincodeTo: r.pincode_to || r.pincodeTo || null,
        price: Number(r.price),
        adjustmentType: r.adjustment_type || r.adjustmentType || 'fixed',
        status: r.status || 'active',
        created_at: r.created_at || r.createdAt,
        updated_at: r.updated_at || r.updatedAt
      };
    });

    // In-memory text search if requested
    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      const numQ = Number(q);
      rules = rules.filter(r => 
        r.pincode.includes(q) ||
        (r.pincodeTo && r.pincodeTo.includes(q)) ||
        (!isNaN(numQ) && r.pincodeTo && numQ >= Number(r.pincode) && numQ <= Number(r.pincodeTo)) ||
        r.productName.toLowerCase().includes(q) ||
        r.variantWeight.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: rules.length,
      rules
    });
  } catch (error) {
    console.error('Get Pincode Pricings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pincode pricing rules.'
    });
  }
};

/**
 * 3. Admin: Update an existing pincode pricing rule
 */
export const updatePincodePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, status, variantWeight, pincode } = req.body;

    const existing = await queryDb('SELECT * FROM pincode_pricing WHERE id = ? LIMIT 1', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pincode pricing rule not found.'
      });
    }

    const currentRule = existing[0];
    const newPrice = price !== undefined ? Number(price) : Number(currentRule.price);
    const newStatus = status !== undefined ? status : (currentRule.status || 'active');
    const newVariant = variantWeight !== undefined ? String(variantWeight).trim() : currentRule.variant_weight;
    const newPincode = pincode !== undefined ? String(pincode).trim() : currentRule.pincode;
    let newPincodeTo = req.body.pincodeTo !== undefined ? (req.body.pincodeTo ? String(req.body.pincodeTo).trim() : null) : (currentRule.pincode_to || currentRule.pincodeTo || null);

    if (isNaN(newPrice) || newPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number greater than 0.'
      });
    }

    if (!/^\d{6}$/.test(newPincode)) {
      return res.status(400).json({
        success: false,
        message: 'Delivery pincode must be exactly 6 digits.'
      });
    }

    if (newPincodeTo) {
      if (!/^\d{6}$/.test(newPincodeTo)) {
        return res.status(400).json({
          success: false,
          message: 'Ending pincode must be exactly 6 digits.'
        });
      }
      if (Number(newPincode) > Number(newPincodeTo)) {
        return res.status(400).json({
          success: false,
          message: 'Starting pincode cannot be greater than ending pincode.'
        });
      }
      if (newPincode === newPincodeTo) newPincodeTo = null;
    }

    const newAdjType = req.body.adjustmentType !== undefined ? req.body.adjustmentType : (currentRule.adjustment_type || 'fixed');

    await queryDb(
      'UPDATE pincode_pricing SET price = ?, status = ?, variant_weight = ?, pincode = ?, pincode_to = ?, adjustment_type = ? WHERE id = ?',
      [newPrice, newStatus, newVariant, newPincode, newPincodeTo, newAdjType, id]
    );

    res.json({
      success: true,
      message: 'Pricing rule updated successfully!',
      rule: {
        id,
        productId: currentRule.product_id,
        variantWeight: newVariant,
        pincode: newPincode,
        pincodeTo: newPincodeTo,
        price: newPrice,
        adjustmentType: newAdjType,
        status: newStatus,
        updated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Update Pincode Pricing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing rule.'
    });
  }
};

/**
 * 4. Admin: Delete a pincode pricing rule
 */
export const deletePincodePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await queryDb('SELECT id FROM pincode_pricing WHERE id = ? LIMIT 1', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found.'
      });
    }

    await queryDb('DELETE FROM pincode_pricing WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pricing rule deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Pincode Pricing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pricing rule.'
    });
  }
};

/**
 * 5. Public / Customer: Fetch active pincode prices for a given pincode
 * GET /api/pincode-pricing?pincode=600017 OR /api/pincode-pricing/:pincode
 */
export const getCustomerPincodePrices = async (req, res) => {
  try {
    const pincode = req.params.pincode || req.query.pincode;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: 'Pincode parameter is required.'
      });
    }

    const cleanPincode = String(pincode).trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).json({
        success: false,
        message: 'Pincode must be exactly 6 digits.'
      });
    }

    const rows = await queryDb(
      `SELECT id, product_id, variant_weight, pincode, pincode_to, price, adjustment_type 
       FROM pincode_pricing 
       WHERE status = 'active'
         AND (
           pincode = ? 
           OR (pincode_to IS NOT NULL AND pincode_to != '' AND pincode <= ? AND pincode_to >= ?)
         )
       ORDER BY 
         CASE WHEN product_id = 'ALL' THEN 1 ELSE 2 END ASC,
         CASE WHEN pincode = ? AND (pincode_to IS NULL OR pincode_to = '' OR pincode_to = pincode) THEN 2 ELSE 1 END ASC`,
      [cleanPincode, cleanPincode, cleanPincode, cleanPincode]
    );

    // Build priceMap: { [productId]: { [normalizedWeight]: price } }
    const priceMap = {};
    const prices = [];
    let storewideAdjustment = null;

    if (Array.isArray(rows)) {
      // 1. If any storewide rule applies to this pincode, pre-populate priceMap for all products
      const storewideRule = rows.find(r => (r.product_id || r.productId) === 'ALL');
      if (storewideRule) {
        storewideAdjustment = {
          type: storewideRule.adjustment_type || 'flat_increase',
          value: Number(storewideRule.price),
          pincode: storewideRule.pincode,
          pincodeTo: storewideRule.pincode_to || null
        };

        const catalog = await getCatalogProducts();
        for (const prod of catalog) {
          if (!priceMap[prod.id]) priceMap[prod.id] = {};
          let weights = prod.weights || prod.weights_json || [];
          if (typeof weights === 'string') {
            try { weights = JSON.parse(weights); } catch { weights = []; }
          }
          if (Array.isArray(weights) && weights.length > 0) {
            for (const w of weights) {
              const baseP = Number(w.price) || Number(prod.price) || 0;
              let adj = baseP;
              if (storewideRule.adjustment_type === 'percent_increase') {
                adj = Math.round(baseP * (1 + Number(storewideRule.price) / 100));
              } else if (storewideRule.adjustment_type === 'fixed') {
                adj = Number(storewideRule.price);
              } else {
                // flat_increase (+₹X)
                adj = Math.round(baseP + Number(storewideRule.price));
              }
              priceMap[prod.id][normalizeWeight(w.label)] = adj;
            }
          } else if (prod.price !== undefined) {
            const baseP = Number(prod.price) || 0;
            let adj = baseP;
            if (storewideRule.adjustment_type === 'percent_increase') {
              adj = Math.round(baseP * (1 + Number(storewideRule.price) / 100));
            } else if (storewideRule.adjustment_type === 'fixed') {
              adj = Number(storewideRule.price);
            } else {
              adj = Math.round(baseP + Number(storewideRule.price));
            }
            priceMap[prod.id]['standard'] = adj;
          }
        }
      }

      // 2. Specific product rules override storewide adjustments
      for (const row of rows) {
        const prodId = row.product_id || row.productId;
        if (prodId === 'ALL') continue; // Already processed into priceMap

        const variant = normalizeWeight(row.variant_weight || row.variantWeight);
        const price = Number(row.price);

        if (!priceMap[prodId]) {
          priceMap[prodId] = {};
        }
        priceMap[prodId][variant] = price;

        prices.push({
          id: row.id,
          productId: prodId,
          variantWeight: row.variant_weight || row.variantWeight,
          price
        });
      }
    }

    res.json({
      success: true,
      pincode: cleanPincode,
      count: prices.length,
      storewideAdjustment,
      priceMap,
      prices
    });
  } catch (error) {
    console.error('Get Customer Pincode Prices Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prices for pincode.'
    });
  }
};

