import { describe, it, expect } from 'vitest';
import { roundCurrency, calculateItemsSubtotal, calculateCouponDiscount, calculateOrderTotals } from '../utils/pricing.js';

describe('Pricing and Money Calculations Unit Tests', () => {
  it('roundCurrency rounds properly to 2 decimal places with paise accuracy', () => {
    expect(roundCurrency(10.555)).toBe(10.56);
    expect(roundCurrency(10.554)).toBe(10.55);
    expect(roundCurrency('490.00')).toBe(490);
    expect(roundCurrency(null)).toBe(0);
    expect(roundCurrency('invalid')).toBe(0);
  });

  describe('calculateItemsSubtotal', () => {
    const mockCatalog = [
      {
        id: 'p-1',
        name: 'Cashews',
        active: true,
        status: 'Active',
        weights: [
          { label: '250g', price: 250 },
          { label: '500g', price: 480 }
        ]
      },
      {
        id: 'p-2',
        name: 'Out of Stock Almonds',
        active: false,
        status: 'Inactive',
        weights: [{ label: 'Standard', price: 300 }]
      }
    ];

    it('calculates correct subtotal with valid item variants', () => {
      const items = [{ id: 'p-1', weight: '250g', quantity: 2 }];
      const result = calculateItemsSubtotal(items, mockCatalog);
      expect(result.subtotal).toBe(500);
      expect(result.validatedItems[0].price).toBe(250);
    });

    it('rejects if item variant does not exist', () => {
      const items = [{ id: 'p-1', weight: '1kg NonExistent', quantity: 1 }];
      expect(() => calculateItemsSubtotal(items, mockCatalog)).toThrow(/does not exist/);
    });

    it('rejects inactive or out of stock items', () => {
      const items = [{ id: 'p-2', weight: 'Standard', quantity: 1 }];
      expect(() => calculateItemsSubtotal(items, mockCatalog)).toThrow(/out of stock/);
    });

    it('rejects missing catalog items', () => {
      const items = [{ id: 'p-999', quantity: 1 }];
      expect(() => calculateItemsSubtotal(items, mockCatalog)).toThrow(/unavailable/);
    });
  });

  describe('calculateCouponDiscount', () => {
    const mockOffers = [
      {
        code: 'SAVE10',
        discountPercent: 10,
        status: 'ACTIVE',
        minOrderAmount: 500,
        startDate: '2020-01-01',
        endDate: '2099-12-31'
      },
      {
        code: 'EXPIRED20',
        discountPercent: 20,
        status: 'ACTIVE',
        minOrderAmount: 100,
        startDate: '2020-01-01',
        endDate: '2021-01-01'
      }
    ];

    it('applies valid coupon discount', () => {
      const { discountAmount } = calculateCouponDiscount({
        couponCode: 'SAVE10',
        subtotal: 1000,
        validatedItems: [],
        serverOffers: mockOffers
      });
      expect(discountAmount).toBe(100);
    });

    it('rejects if subtotal is below minimum order value', () => {
      expect(() => calculateCouponDiscount({
        couponCode: 'SAVE10',
        subtotal: 400,
        validatedItems: [],
        serverOffers: mockOffers
      })).toThrow(/Minimum order value/);
    });

    it('rejects expired coupon', () => {
      expect(() => calculateCouponDiscount({
        couponCode: 'EXPIRED20',
        subtotal: 1000,
        validatedItems: [],
        serverOffers: mockOffers
      })).toThrow(/expired/);
    });
  });

  describe('calculateOrderTotals', () => {
    it('applies delivery fee when subtotal is below threshold', () => {
      const totals = calculateOrderTotals({
        subtotal: 800,
        discountAmount: 0,
        storeSettings: { freeDeliveryThreshold: 1000, deliveryFee: 60 }
      });
      expect(totals.subtotal).toBe(800);
      expect(totals.deliveryCharge).toBe(60);
      expect(totals.totalAmount).toBe(860);
    });

    it('gives free delivery when subtotal meets threshold', () => {
      const totals = calculateOrderTotals({
        subtotal: 1200,
        discountAmount: 0,
        storeSettings: { freeDeliveryThreshold: 1000, deliveryFee: 60 }
      });
      expect(totals.deliveryCharge).toBe(0);
      expect(totals.totalAmount).toBe(1200);
    });

    it('totalAmount never drops below zero even with large discounts', () => {
      const totals = calculateOrderTotals({
        subtotal: 100,
        discountAmount: 200,
        storeSettings: { freeDeliveryThreshold: 1000, deliveryFee: 50 }
      });
      expect(totals.totalAmount).toBeGreaterThanOrEqual(0);
    });
  });
});
