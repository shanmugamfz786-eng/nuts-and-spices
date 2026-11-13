import { apiFetch } from './index.js';

/**
 * Public: Fetch all active delivery zones and rates
 */
export const fetchPublicShippingRates = async () => {
  return apiFetch('/shipping-rates');
};

/**
 * Public: Calculate delivery fee given pincode, items, and subtotal
 */
export const calculateShippingFeeApi = async ({ pincode, items = [], subtotal = 0 }) => {
  return apiFetch('/shipping-rates/calculate', {
    method: 'POST',
    body: JSON.stringify({ pincode, items, subtotal })
  });
};

/**
 * Admin: List all shipping rate rules
 */
export const fetchAdminShippingRates = async () => {
  return apiFetch('/shipping-rates/admin/all');
};

/**
 * Admin: Create a new shipping rate rule
 */
export const createAdminShippingRate = async (rateData) => {
  return apiFetch('/shipping-rates/admin/create', {
    method: 'POST',
    body: JSON.stringify(rateData)
  });
};

/**
 * Admin: Update an existing shipping rate rule
 */
export const updateAdminShippingRate = async (id, rateData) => {
  return apiFetch(`/shipping-rates/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rateData)
  });
};

/**
 * Admin: Delete a shipping rate rule
 */
export const deleteAdminShippingRate = async (id) => {
  return apiFetch(`/shipping-rates/admin/${id}`, {
    method: 'DELETE'
  });
};

