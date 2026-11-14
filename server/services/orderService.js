import crypto from 'crypto';

/**
 * Order Service
 * Handles state transitions, validation, and lifecycle management
 */

export const ORDER_STATUS_TRANSITIONS = {
  pending: ['new', 'confirmed', 'cancelled'],
  new: ['confirmed', 'preparing', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
  confirmed: ['new', 'preparing', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
  preparing: ['new', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'cancelled'],
  shipped: ['preparing', 'out for delivery', 'delivered', 'cancelled'],
  'out for delivery': ['preparing', 'shipped', 'delivered', 'cancelled'],
  delivered: [],
  cancelled: []
};

export class OrderService {
  /**
   * Validate if a status transition is permitted
   */
  static isValidStatusTransition(currentStatus, nextStatus) {
    const cur = String(currentStatus || 'pending').toLowerCase();
    const next = String(nextStatus || '').toLowerCase();

    if (cur === next) return true;

    const allowed = ORDER_STATUS_TRANSITIONS[cur] || [];
    return allowed.includes(next);
  }

  /**
   * Generate secure alphanumeric order ID with HNS- prefix
   */
  static generateOrderId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      code += chars[bytes[i] % chars.length];
    }
    return `HNS-${code}`;
  }
}

export default OrderService;
