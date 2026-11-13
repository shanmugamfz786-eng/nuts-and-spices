/**
 * Centralized financial and pricing calculations for Haji Nuts & Spices.
 * Ensures consistent paise rounding and validation across all checkout and order flows.
 */

/**
 * Round a currency amount safely to 2 decimal places.
 */
export function roundCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate items subtotal and validate requested items against catalog.
 * Throws an error with a clear message if an item or variant is missing or out of stock.
 */
export function calculateItemsSubtotal(items, catalogProducts, pincodePricesMap = null) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order items list is empty.');
  }

  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const productId = item.productId || item.id;
    const backendProduct = catalogProducts.find(p => p.id === productId);

    if (!backendProduct) {
      throw new Error(`Product '${item.name || productId}' is unavailable.`);
    }

    if (backendProduct.status === 'Inactive' || backendProduct.active === false) {
      throw new Error(`Product '${backendProduct.name}' is currently out of stock.`);
    }

    // Parse product weights
    let productWeights = backendProduct.weights || backendProduct.weights_json || [];
    if (typeof productWeights === 'string') {
      try {
        productWeights = JSON.parse(productWeights);
      } catch (e) {
        productWeights = [];
      }
    }

    let defaultPrice = null;
    let selectedWeightLabel = '';

    if (Array.isArray(productWeights) && productWeights.length > 0) {
      if (item.weight) {
        const itemWeightNormalized = String(item.weight).toLowerCase().trim();
        const variant = productWeights.find(w => String(w.label || '').toLowerCase().trim() === itemWeightNormalized);
        if (!variant) {
          throw new Error(`Variant '${item.weight}' does not exist for product '${backendProduct.name}'.`);
        }
        defaultPrice = Number(variant.price);
        selectedWeightLabel = variant.label;
      } else {
        defaultPrice = Number(productWeights[0].price);
        selectedWeightLabel = productWeights[0].label;
      }
    } else if (backendProduct.price !== undefined && backendProduct.price !== null) {
      defaultPrice = Number(backendProduct.price);
      selectedWeightLabel = 'Standard';
    } else {
      throw new Error(`Pricing configuration missing for product '${backendProduct.name}'.`);
    }

    // Check if an admin-configured pincode price override exists for this product & variant
    let realPrice = defaultPrice;
    if (pincodePricesMap && typeof pincodePricesMap === 'object') {
      const prodKey = backendProduct.id;
      const variantKey = String(selectedWeightLabel || item.weight || '').toLowerCase().trim();
      const directKey = `${prodKey}:::${variantKey}`;
      
      if (pincodePricesMap[directKey] !== undefined && !isNaN(Number(pincodePricesMap[directKey]))) {
        realPrice = Number(pincodePricesMap[directKey]);
      } else if (pincodePricesMap[prodKey] && typeof pincodePricesMap[prodKey] === 'object' && pincodePricesMap[prodKey][variantKey] !== undefined) {
        realPrice = Number(pincodePricesMap[prodKey][variantKey]);
      } else if (pincodePricesMap['__STOREWIDE__']) {
        const adj = pincodePricesMap['__STOREWIDE__'];
        if (adj.type === 'percent_increase') {
          realPrice = roundCurrency(defaultPrice * (1 + (Number(adj.value) || 0) / 100));
        } else if (adj.type === 'fixed') {
          realPrice = Number(adj.value);
        } else {
          // default: flat_increase (+₹X)
          realPrice = roundCurrency(defaultPrice + (Number(adj.value) || 0));
        }
      }
    }

    if (isNaN(realPrice) || realPrice <= 0) {
      throw new Error(`Invalid catalog price for product '${backendProduct.name}'.`);
    }

    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0 || qty > 100) {
      throw new Error(`Quantity for '${backendProduct.name}' must be an integer between 1 and 100.`);
    }

    const lineTotal = roundCurrency(realPrice * qty);
    subtotal = roundCurrency(subtotal + lineTotal);

    validatedItems.push({
      ...item,
      id: backendProduct.id,
      productId: backendProduct.id,
      price: realPrice,
      name: backendProduct.name,
      weight: selectedWeightLabel || item.weight,
      category: backendProduct.category || item.category,
      categoryId: backendProduct.category_id || backendProduct.category || item.categoryId
    });
  }

  return { subtotal, validatedItems };
}

/**
 * Validate coupon code and compute discount amount.
 */
export function calculateCouponDiscount({
  couponCode,
  subtotal,
  validatedItems,
  serverOffers = [],
  customerPhone = '',
  pastCustomerOrders = []
}) {
  if (!couponCode || typeof couponCode !== 'string' || !couponCode.trim()) {
    return { discountAmount: 0, appliedOffer: null };
  }

  const rawCode = couponCode.trim().toUpperCase();
  const matchingOffer = serverOffers.find(o => {
    const oCode = (o.code || `HAJI${o.discountPercent}`).trim().toUpperCase();
    return oCode === rawCode;
  });

  if (!matchingOffer) {
    throw new Error(`Coupon code '${rawCode}' is invalid.`);
  }

  if (matchingOffer.status && matchingOffer.status !== 'ACTIVE') {
    throw new Error(`Coupon '${rawCode}' is inactive.`);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (matchingOffer.startDate && todayStr < matchingOffer.startDate) {
    throw new Error(`Coupon '${rawCode}' is not active yet.`);
  }
  if (matchingOffer.endDate && todayStr > matchingOffer.endDate) {
    throw new Error(`Coupon '${rawCode}' has expired.`);
  }

  // Check one-time / usage limit per customer
  if (matchingOffer.oneTimePerCustomer && customerPhone && Array.isArray(pastCustomerOrders)) {
    const alreadyUsed = pastCustomerOrders.some(o => 
      o.notes && o.notes.toUpperCase().includes(`COUPON: ${rawCode}`) && o.status !== 'cancelled'
    );
    if (alreadyUsed) {
      throw new Error(`Coupon '${rawCode}' has already been redeemed for this phone number.`);
    }
  }

  const minSpend = Number(matchingOffer.minOrderAmount) || 0;
  if (subtotal < minSpend) {
    throw new Error(`Minimum order value of ₹${minSpend} required for coupon '${rawCode}'. (Current: ₹${subtotal})`);
  }

  // Category specific coupon restriction
  let eligibleSubtotal = subtotal;
  const applicableCat = matchingOffer.applicableCategory;
  if (applicableCat && applicableCat !== 'all') {
    eligibleSubtotal = validatedItems
      .filter(it => it.categoryId === applicableCat || it.category === applicableCat)
      .reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);

    if (eligibleSubtotal === 0) {
      throw new Error(`Coupon '${rawCode}' is only valid on ${matchingOffer.applicableCategoryName || 'eligible'} items.`);
    }
  }

  const discountPct = Number(matchingOffer.discountPercent) || 0;
  // Calculate discount percentage strictly over eligible subtotal
  let calculatedDiscount = roundCurrency((eligibleSubtotal * discountPct) / 100);

  // Discount can never exceed eligible subtotal
  calculatedDiscount = Math.min(calculatedDiscount, eligibleSubtotal);

  return {
    discountAmount: Math.max(0, calculatedDiscount),
    appliedOffer: matchingOffer
  };
}

/**
 * Parse weight string (e.g. '100g', '250g', '500g', '1kg', '2 kg', '500 gm') into integer grams.
 */
export function parseWeightInGrams(weightInput) {
  if (!weightInput) return 500;
  const str = String(weightInput).toLowerCase().trim();
  
  // match kg (e.g. "1kg", "1.5kg", "2 kg")
  const kgMatch = str.match(/([0-9]+(?:\.[0-9]+)?)\s*kg/);
  if (kgMatch) {
    return Math.round(parseFloat(kgMatch[1]) * 1000);
  }
  
  // match g / gm / grams (e.g. "100g", "250g", "500 gm", "750 grams")
  const gMatch = str.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:g|gm|gms|gram|grams)/);
  if (gMatch) {
    return Math.round(parseFloat(gMatch[1]));
  }

  // match plain numbers
  const numMatch = str.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    return val <= 10 ? Math.round(val * 1000) : Math.round(val);
  }

  return 500;
}

/**
 * Calculate total package weight in grams from item list.
 */
export function calculateCartWeightGrams(items) {
  if (!Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const itemWeightStr = item.weight || item.selectedWeight || item.label || '500g';
    const grams = parseWeightInGrams(itemWeightStr);
    return sum + (qty * grams);
  }, 0);
}

/**
 * Match a pincode against list of shipping delivery rules.
 */
export function matchShippingDeliveryRule(pincode, rulesList) {
  if (!pincode || !Array.isArray(rulesList) || rulesList.length === 0) return null;
  const cleanPin = String(pincode).trim();
  const pinNum = parseInt(cleanPin, 10);

  // 1. Exact single pincode match
  const exactMatch = rulesList.find(r => 
    (r.is_active === 1 || r.is_active === true) && 
    String(r.pincode_from).trim() === cleanPin && 
    (!r.pincode_to || String(r.pincode_to).trim() === cleanPin || String(r.pincode_to).trim() === '')
  );
  if (exactMatch) return exactMatch;

  // 2. Numeric Range match (e.g. 600001 to 643999)
  if (!isNaN(pinNum)) {
    const rangeMatch = rulesList.find(r => {
      if (r.is_active !== 1 && r.is_active !== true) return false;
      const fromNum = parseInt(r.pincode_from, 10);
      const toNum = parseInt(r.pincode_to, 10);
      if (!isNaN(fromNum) && !isNaN(toNum)) {
        return pinNum >= Math.min(fromNum, toNum) && pinNum <= Math.max(fromNum, toNum);
      }
      return false;
    });
    if (rangeMatch) return rangeMatch;
  }

  // 3. Fallback to DEFAULT rule
  const defaultRule = rulesList.find(r => 
    (r.is_active === 1 || r.is_active === true) && 
    (String(r.pincode_from).toUpperCase() === 'DEFAULT' || String(r.zone_name).toLowerCase().includes('default'))
  );
  return defaultRule || null;
}

/**
 * Parse weight slabs JSON safely into an array of objects.
 */
export function parseWeightSlabs(slabsField) {
  if (!slabsField) return [];
  if (Array.isArray(slabsField)) return slabsField;
  if (typeof slabsField === 'string') {
    try {
      const parsed = JSON.parse(slabsField);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Calculate delivery fee based on total weight (grams), subtotal, and matching shipping rule.
 * Supports explicit manual weight slabs (e.g. 0-250g, 251-500g, 501-1000g) with fallback to base/extra rate.
 */
export function calculateDeliveryFeeByWeight({ weightGrams, subtotal, rule }) {
  if (!rule) {
    return 0;
  }

  const freeThreshold = Number(rule.free_shipping_threshold) || 0;
  if (freeThreshold > 0 && subtotal >= freeThreshold) {
    return 0; // Free delivery
  }

  const slabs = parseWeightSlabs(rule.weight_slabs_json || rule.weightSlabs);
  if (slabs.length > 0) {
    // Sort slabs by minWeightGrams ascending
    const sortedSlabs = [...slabs]
      .filter(s => s && !isNaN(Number(s.rate)))
      .sort((a, b) => (Number(a.minWeightGrams) || 0) - (Number(b.minWeightGrams) || 0));

    if (sortedSlabs.length > 0) {
      // 1. Direct slab match
      for (const slab of sortedSlabs) {
        const minW = Number(slab.minWeightGrams) || 0;
        const maxW = Number(slab.maxWeightGrams) || 0;
        const rate = Number(slab.rate) || 0;
        if (weightGrams >= minW && weightGrams <= maxW) {
          return rate;
        }
      }

      // 2. If weight is below the lowest slab's minimum
      const firstSlab = sortedSlabs[0];
      if (weightGrams < (Number(firstSlab.minWeightGrams) || 0)) {
        return Number(firstSlab.rate) || 0;
      }

      // 3. If weight exceeds the highest slab's maximum:
      // Take the highest slab rate + additional rate per extra additional_weight_grams
      const lastSlab = sortedSlabs[sortedSlabs.length - 1];
      const highestMax = Number(lastSlab.maxWeightGrams) || 1000;
      const highestRate = Number(lastSlab.rate) || 0;
      const additionalWeight = Number(rule.additional_weight_grams) || 1000;
      const additionalRate = Number(rule.additional_rate) || 30;

      const extraWeight = weightGrams - highestMax;
      const extraSlabs = Math.ceil(extraWeight / additionalWeight);
      return highestRate + (extraSlabs * additionalRate);
    }
  }

  // Fallback to base/extra formula if no custom slabs
  const baseWeight = Number(rule.base_weight_grams) || 1000;
  const baseRate = Number(rule.base_rate) || 0;
  const additionalWeight = Number(rule.additional_weight_grams) || 1000;
  const additionalRate = Number(rule.additional_rate) || 0;

  if (weightGrams <= baseWeight) {
    return baseRate;
  }

  const extraWeight = weightGrams - baseWeight;
  const extraSlabs = Math.ceil(extraWeight / additionalWeight);
  return baseRate + (extraSlabs * additionalRate);
}

/**
 * Calculate final order totals (subtotal, delivery charge, totalAmount).
 */
export function calculateOrderTotals({
  subtotal,
  discountAmount = 0,
  storeSettings = {},
  deliveryCharge: explicitDeliveryCharge = null
}) {
  let deliveryCharge = 0;

  if (explicitDeliveryCharge !== null && explicitDeliveryCharge !== undefined && !isNaN(Number(explicitDeliveryCharge))) {
    deliveryCharge = Math.max(0, roundCurrency(Number(explicitDeliveryCharge)));
  } else {
    // Resolve Free Delivery Threshold (matches AdminSettings 'minOrderAmount' or legacy 'freeDeliveryThreshold')
    const rawThreshold = storeSettings.minOrderAmount !== undefined && storeSettings.minOrderAmount !== null
      ? storeSettings.minOrderAmount
      : storeSettings.freeDeliveryThreshold;
    const freeThreshold = rawThreshold !== undefined && rawThreshold !== null && !isNaN(Number(rawThreshold))
      ? Number(rawThreshold)
      : 500;

    // Resolve Standard Delivery Fee (matches AdminSettings 'deliveryCharge' or legacy 'deliveryFee')
    const rawFee = storeSettings.deliveryCharge !== undefined && storeSettings.deliveryCharge !== null
      ? storeSettings.deliveryCharge
      : storeSettings.deliveryFee;
    const flatFee = rawFee !== undefined && rawFee !== null && !isNaN(Number(rawFee))
      ? Number(rawFee)
      : 0;

    // Effective subtotal after discount
    const effectiveSubtotal = Math.max(0, roundCurrency(subtotal - discountAmount));
    deliveryCharge = (flatFee === 0 || effectiveSubtotal === 0 || (freeThreshold > 0 && effectiveSubtotal >= freeThreshold)) ? 0 : flatFee;
  }

  const effectiveSubtotal = Math.max(0, roundCurrency(subtotal - discountAmount));
  const totalAmount = Math.max(0, roundCurrency(effectiveSubtotal + deliveryCharge));

  return {
    subtotal: roundCurrency(subtotal),
    discountAmount: roundCurrency(discountAmount),
    deliveryCharge: roundCurrency(deliveryCharge),
    totalAmount: roundCurrency(totalAmount)
  };
}
