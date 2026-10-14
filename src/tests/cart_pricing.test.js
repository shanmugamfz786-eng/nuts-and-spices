import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { roundCurrency, calculateItemsSubtotal, calculateCouponDiscount, calculateOrderTotals } from '../../server/utils/pricing.js';

describe('Frontend & Cart Pricing Calculations', () => {
  test('roundCurrency rounds properly to 2 decimals', () => {
    assert.strictEqual(roundCurrency(123.456), 123.46);
    assert.strictEqual(roundCurrency(123.4), 123.4);
    assert.strictEqual(roundCurrency('not-a-number'), 0);
  });

  test('calculateItemsSubtotal accurately totals cart items using weight variant price', () => {
    const catalog = [
      {
        id: 'p1',
        name: 'Almonds',
        active: true,
        status: 'Active',
        weights: [
          { label: '250g', price: 300 },
          { label: '500g', price: 550 }
        ]
      }
    ];

    const cart = [
      { id: 'p1', weight: '250g', quantity: 2 },
      { id: 'p1', weight: '500g', quantity: 1 }
    ];

    const { subtotal, validatedItems } = calculateItemsSubtotal(cart, catalog);
    assert.strictEqual(subtotal, 1150);
    assert.strictEqual(validatedItems.length, 2);
  });

  test('calculateCouponDiscount respects percentage and minimum spend', () => {
    const mockOffers = [
      {
        code: 'FESTIVE10',
        discountPercent: 10,
        minOrderAmount: 500,
        status: 'ACTIVE',
        startDate: '2020-01-01',
        endDate: '2099-12-31'
      }
    ];

    assert.throws(
      () => calculateCouponDiscount({ couponCode: 'FESTIVE10', subtotal: 400, validatedItems: [], serverOffers: mockOffers }),
      /Minimum order value/
    );

    const { discountAmount } = calculateCouponDiscount({
      couponCode: 'FESTIVE10',
      subtotal: 1000,
      validatedItems: [],
      serverOffers: mockOffers
    });
    assert.strictEqual(discountAmount, 100);
  });

  test('calculateOrderTotals applies free delivery over threshold', () => {
    const resultUnder = calculateOrderTotals({
      subtotal: 300,
      discountAmount: 0,
      storeSettings: { freeDeliveryThreshold: 500, deliveryFee: 50 }
    });
    assert.strictEqual(resultUnder.deliveryCharge, 50);
    assert.strictEqual(resultUnder.totalAmount, 350);

    const resultOver = calculateOrderTotals({
      subtotal: 600,
      discountAmount: 50,
      storeSettings: { freeDeliveryThreshold: 500, deliveryFee: 50 }
    });
    assert.strictEqual(resultOver.deliveryCharge, 0);
    assert.strictEqual(resultOver.totalAmount, 550);
  });
});
