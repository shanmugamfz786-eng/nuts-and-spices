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
export function calculateItemsSubtotal(items, catalogProducts) {
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

    let realPrice = null;

    if (Array.isArray(productWeights) && productWeights.length > 0) {
      if (item.weight) {
        const itemWeightNormalized = String(item.weight).toLowerCase().trim();
        const variant = productWeights.find(w => String(w.label || '').toLowerCase().trim() === itemWeightNormalized);
        if (!variant) {
          throw new Error(`Variant '${item.weight}' does not exist for product '${backendProduct.name}'.`);
        }
        realPrice = Number(variant.price);
      } else {
        realPrice = Number(productWeights[0].price);
      }
    } else if (backendProduct.price !== undefined && backendProduct.price !== null) {
      realPrice = Number(backendProduct.price);
    } else {
      throw new Error(`Pricing configuration missing for product '${backendProduct.name}'.`);
    }

    if (isNaN(realPrice) || realPrice < 0) {
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
 * Calculate final order totals (subtotal, delivery charge, totalAmount).
 */
export function calculateOrderTotals({
  subtotal,
  discountAmount = 0,
  storeSettings = {}
}) {
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
    : 50;

  // Effective subtotal after discount
  const effectiveSubtotal = Math.max(0, roundCurrency(subtotal - discountAmount));
  const deliveryCharge = (effectiveSubtotal >= freeThreshold || effectiveSubtotal === 0 || flatFee === 0) ? 0 : flatFee;
  const totalAmount = Math.max(0, roundCurrency(effectiveSubtotal + deliveryCharge));

  return {
    subtotal: roundCurrency(subtotal),
    discountAmount: roundCurrency(discountAmount),
    deliveryCharge: roundCurrency(deliveryCharge),
    totalAmount: roundCurrency(totalAmount)
  };
}
