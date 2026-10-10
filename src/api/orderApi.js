import { apiFetch } from './index.js';

export const createOrder = (orderPayload) => apiFetch('/orders', {
  method: 'POST',
  body: JSON.stringify(orderPayload)
});

export const getOrders = () => apiFetch('/orders');
export const fetchOrdersApi = () => apiFetch('/orders');

export const getOrderById = (id) => apiFetch(`/orders/${id}`);

export const updateOrderStatus = (id, status) => apiFetch(`/orders/${id}/status`, {
  method: 'PUT',
  body: JSON.stringify({ status })
});
