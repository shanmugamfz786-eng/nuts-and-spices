import { apiFetch } from './index.js';

/**
 * Fetch active pricing rules for a customer's delivery pincode
 * @param {string} pincode 6-digit postal code
 */
export const fetchPincodePrices = async (pincode) => {
  if (!pincode || !/^\d{6}$/.test(String(pincode).trim())) {
    return { success: false, priceMap: {}, prices: [] };
  }
  const cleanPin = String(pincode).trim();
  return apiFetch(`/pincode-pricing/lookup?pincode=${cleanPin}`);
};

/**
 * Admin: List all pincode pricing rules
 */
export const fetchAdminPincodePricings = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.productId) query.append('productId', params.productId);
  if (params.pincode) query.append('pincode', params.pincode);
  if (params.status) query.append('status', params.status);

  const qs = query.toString();
  return apiFetch(`/pincode-pricing/admin/all${qs ? `?${qs}` : ''}`);
};

/**
 * Admin: Create a new pincode pricing rule
 */
export const createAdminPincodePricing = async (data) => {
  return apiFetch('/pincode-pricing/admin/create', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/**
 * Admin: Update an existing pincode pricing rule
 */
export const updateAdminPincodePricing = async (id, data) => {
  return apiFetch(`/pincode-pricing/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

/**
 * Admin: Delete a pincode pricing rule
 */
export const deleteAdminPincodePricing = async (id) => {
  return apiFetch(`/pincode-pricing/admin/${id}`, {
    method: 'DELETE'
  });
};

/**
 * Customer: Update user profile delivery pincode
 */
export const updateUserPincodeApi = async (pincode) => {
  return apiFetch('/auth/me', {
    method: 'PUT',
    body: JSON.stringify({ pincode })
  });
};

