import crypto from 'crypto';

/**
 * Order Service
 * Handles state transitions, validation, and lifecycle management
 */

export const ORDER_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  new: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled', 'refunded'],
  preparing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'cancelled', 'refunded'],
  delivered: ['refunded'],
  cancelled: ['refund_pending', 'refunded'],
  refund_pending: ['refunded'],
  refunded: []
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
