import crypto from 'crypto';

/**
 * Order Service
 * Handles state transitions, validation, and lifecycle management
 */

export const ORDER_STATUS_TRANSITIONS = {
  pending: ['new', 'preparing', 'prepare', 'confirmed', 'cancelled'],
  new: ['preparing', 'prepare', 'confirmed', 'out for delivery', 'delivered', 'cancelled'],
  prepare: ['new', 'preparing', 'confirmed', 'out for delivery', 'delivered', 'cancelled'],
  preparing: ['new', 'prepare', 'confirmed', 'out for delivery', 'delivered', 'cancelled'],
  confirmed: ['new', 'preparing', 'prepare', 'out for delivery', 'delivered', 'cancelled'],
  shipped: ['preparing', 'confirmed', 'out for delivery', 'delivered', 'cancelled'],
  'out for delivery': ['preparing', 'confirmed', 'delivered', 'cancelled'],
  delivered: ['out for delivery', 'cancelled'],
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
