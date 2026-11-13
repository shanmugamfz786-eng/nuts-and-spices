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
