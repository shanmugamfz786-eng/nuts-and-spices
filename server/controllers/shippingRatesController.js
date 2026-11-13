import { queryDb, memoryStore } from '../config/db.js';
import { 
  calculateCartWeightGrams, 
  matchShippingDeliveryRule, 
  calculateDeliveryFeeByWeight 
} from '../utils/pricing.js';
import crypto from 'crypto';

/**
 * Public: Fetch all active delivery zones and rates.
 */
export const getPublicShippingRates = async (req, res) => {
  try {
    let rows = [];
    try {
      rows = await queryDb("SELECT * FROM shipping_delivery_rates WHERE is_active = 1 ORDER BY zone_name ASC");
    } catch (e) {
      console.warn('Fallback to memoryStore for shipping_delivery_rates:', e.message);
    }
    if (!rows || rows.length === 0) {
      rows = (memoryStore.shipping_delivery_rates || []).filter(r => r.is_active === 1 || r.is_active === true);
    }
    return res.json({ success: true, rates: rows });
  } catch (error) {
    console.error('getPublicShippingRates error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch shipping rates.' });
  }
};

/**
 * Public: Calculate delivery fee based on pincode, items, and subtotal.
 */
export const calculateShippingFee = async (req, res) => {
  try {
    const { pincode, items = [], subtotal = 0 } = req.body;
    if (!pincode) {
      return res.status(400).json({ success: false, message: 'Pincode is required.' });
    }

    const totalWeightGrams = calculateCartWeightGrams(items);
    const totalWeightKg = (totalWeightGrams / 1000).toFixed(2);

    let rates = [];
    try {
      rates = await queryDb("SELECT * FROM shipping_delivery_rates WHERE is_active = 1");
    } catch (e) {}
    if (!rates || rates.length === 0) {
      rates = (memoryStore.shipping_delivery_rates || []).filter(r => r.is_active === 1 || r.is_active === true);
    }

    const matchedRule = matchShippingDeliveryRule(pincode, rates);
    if (!matchedRule) {
      return res.json({
        success: true,
        pincode,
        matched: false,
        zoneName: 'Standard Delivery',
        totalWeightGrams,
        totalWeightKg,
        baseRate: 50,
        additionalRate: 30,
        deliveryFee: 50,
        isFreeDelivery: false
      });
    }

    const deliveryFee = calculateDeliveryFeeByWeight({
      weightGrams: totalWeightGrams,
      subtotal: Number(subtotal) || 0,
      rule: matchedRule
    });

    const isFree = Number(matchedRule.free_shipping_threshold) > 0 && Number(subtotal) >= Number(matchedRule.free_shipping_threshold);

    return res.json({
      success: true,
      pincode,
      matched: true,
      zoneName: matchedRule.zone_name,
      totalWeightGrams,
      totalWeightKg,
      baseWeightKg: ((Number(matchedRule.base_weight_grams) || 1000) / 1000).toFixed(2),
      baseRate: Number(matchedRule.base_rate),
      additionalRate: Number(matchedRule.additional_rate),
      freeThreshold: Number(matchedRule.free_shipping_threshold),
      deliveryFee,
      isFreeDelivery: isFree
    });
  } catch (error) {
    console.error('calculateShippingFee error:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate shipping fee.' });
  }
};

/**
 * Admin: Fetch all shipping rates (active & inactive).
 */
export const getAllShippingRatesAdmin = async (req, res) => {
  try {
    let rows = [];
    try {
      rows = await queryDb("SELECT * FROM shipping_delivery_rates ORDER BY created_at DESC");
    } catch (e) {}
    if (!rows || rows.length === 0) {
      rows = memoryStore.shipping_delivery_rates || [];
    }
    return res.json({ success: true, rates: rows });
  } catch (error) {
    console.error('getAllShippingRatesAdmin error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin shipping rates.' });
  }
};

/**
 * Admin: Create a new shipping rate rule.
 */
export const createShippingRateAdmin = async (req, res) => {
  try {
    const {
      zone_name,
      pincode_from,
      pincode_to,
      base_weight_grams = 1000,
      base_rate,
      additional_weight_grams = 1000,
      additional_rate,
      free_shipping_threshold = 0,
      is_active = 1
    } = req.body;

    if (!zone_name || !pincode_from || base_rate === undefined || additional_rate === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'zone_name, pincode_from, base_rate, and additional_rate are required.' 
      });
    }

    const id = `ship_${crypto.randomBytes(4).toString('hex')}`;
    const cleanFrom = String(pincode_from).trim();
    const cleanTo = String(pincode_to || pincode_from).trim();
    const bRate = Number(base_rate);
    const addRate = Number(additional_rate);
    const bWeight = Number(base_weight_grams) || 1000;
    const addWeight = Number(additional_weight_grams) || 1000;
    const freeThresh = Number(free_shipping_threshold) || 0;
    const activeVal = is_active ? 1 : 0;

    await queryDb(
      `INSERT INTO shipping_delivery_rates 
      (id, zone_name, pincode_from, pincode_to, base_weight_grams, base_rate, additional_weight_grams, additional_rate, free_shipping_threshold, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, zone_name.trim(), cleanFrom, cleanTo, bWeight, bRate, addWeight, addRate, freeThresh, activeVal]
    );

    return res.status(201).json({
      success: true,
      message: 'Shipping rate created successfully.',
      rate: {
        id,
        zone_name: zone_name.trim(),
        pincode_from: cleanFrom,
        pincode_to: cleanTo,
        base_weight_grams: bWeight,
        base_rate: bRate,
        additional_weight_grams: addWeight,
        additional_rate: addRate,
        free_shipping_threshold: freeThresh,
        is_active: activeVal
      }
    });
  } catch (error) {
    console.error('createShippingRateAdmin error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create shipping rate.' });
  }
};

/**
 * Admin: Update an existing shipping rate rule.
 */
export const updateShippingRateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      zone_name,
      pincode_from,
      pincode_to,
      base_weight_grams = 1000,
      base_rate,
      additional_weight_grams = 1000,
      additional_rate,
      free_shipping_threshold = 0,
      is_active
    } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Rule ID is required.' });
    }

    const bRate = Number(base_rate);
    const addRate = Number(additional_rate);
    const bWeight = Number(base_weight_grams) || 1000;
    const addWeight = Number(additional_weight_grams) || 1000;
    const freeThresh = Number(free_shipping_threshold) || 0;
    const activeVal = is_active !== undefined ? (is_active ? 1 : 0) : 1;

    await queryDb(
      `UPDATE shipping_delivery_rates 
      SET zone_name = ?, pincode_from = ?, pincode_to = ?, base_weight_grams = ?, base_rate = ?, additional_weight_grams = ?, additional_rate = ?, free_shipping_threshold = ?, is_active = ?
      WHERE id = ?`,
      [zone_name, pincode_from, pincode_to, bWeight, bRate, addWeight, addRate, freeThresh, activeVal, id]
    );

    return res.json({ success: true, message: 'Shipping rate updated successfully.' });
  } catch (error) {
    console.error('updateShippingRateAdmin error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update shipping rate.' });
  }
};

/**
 * Admin: Delete a shipping rate rule.
 */
export const deleteShippingRateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Rule ID is required.' });
    }

    await queryDb("DELETE FROM shipping_delivery_rates WHERE id = ?", [id]);
    return res.json({ success: true, message: 'Shipping rate deleted successfully.' });
  } catch (error) {
    console.error('deleteShippingRateAdmin error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete shipping rate.' });
  }
};
