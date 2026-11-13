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
 * Format grams into human readable text (e.g. 1500g -> "1.50 Kg", 500g -> "500 g").
 */
export function formatWeight(grams) {
  const g = Number(grams) || 0;
  if (g >= 1000) {
    return `${(g / 1000).toFixed(2)} Kg`;
  }
  return `${g} g`;
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
 * Calculate delivery fee on client matching server logic exactly.
 */
export function calculateDeliveryFeeFromRule({ weightGrams, subtotal = 0, rule }) {
  if (!rule) return 0;
  const freeThreshold = Number(rule.free_shipping_threshold) || 0;
  if (freeThreshold > 0 && Number(subtotal) >= freeThreshold) {
    return 0;
  }

  const slabs = parseWeightSlabs(rule.weight_slabs_json || rule.weightSlabs);
  if (slabs.length > 0) {
    const sortedSlabs = [...slabs]
      .filter(s => s && !isNaN(Number(s.rate)))
      .sort((a, b) => (Number(a.minWeightGrams) || 0) - (Number(b.minWeightGrams) || 0));

    if (sortedSlabs.length > 0) {
      for (const slab of sortedSlabs) {
        const minW = Number(slab.minWeightGrams) || 0;
        const maxW = Number(slab.maxWeightGrams) || 0;
        const rate = Number(slab.rate) || 0;
        if (weightGrams >= minW && weightGrams <= maxW) {
          return rate;
        }
      }
      const firstSlab = sortedSlabs[0];
      if (weightGrams < (Number(firstSlab.minWeightGrams) || 0)) {
        return Number(firstSlab.rate) || 0;
      }
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

