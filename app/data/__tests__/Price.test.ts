import {
  getTotalPrice,
  calculatePrice,
  formatPrice,
  MIN_BEACONS_FOR_DISCOUNT,
  DISCOUNT_PERCENT,
} from '../Price';

describe('getTotalPrice', () => {
  test('should return correct price without discount', () => {
    const result = getTotalPrice(3, 100);
    expect(result).toEqual(300);
  });

  test('should apply discount when eligible', () => {
    const result = getTotalPrice(6, 100);
    // 600 - 15% discount = 510
    expect(result).toEqual(510);
  });

  test('should handle exactly minimum number of beacons for discount', () => {
    const result = getTotalPrice(MIN_BEACONS_FOR_DISCOUNT, 100);
    // 500 - 15% discount = 425
    expect(result).toEqual(425);
  });

  test('should handle zero beacons', () => {
    const result = getTotalPrice(0, 100);
    expect(result).toEqual(0);
  });

  test('should handle negative beacons', () => {
    const result = getTotalPrice(-1, 100);
    expect(result).toEqual(0);
  });

  test('should handle negative price', () => {
    const result = getTotalPrice(5, -10);
    expect(result).toEqual(0);
  });
});

describe('calculatePrice', () => {
  test('should calculate detailed price info without discount', () => {
    const result = calculatePrice(3, 100);
    expect(result).toEqual({
      basePrice: 300,
      discount: 0,
      totalPrice: 300,
      discountApplied: false,
    });
  });

  test('should calculate detailed price info with discount', () => {
    const result = calculatePrice(6, 100);
    expect(result).toEqual({
      basePrice: 600,
      discount: 90,
      totalPrice: 510,
      discountApplied: true,
    });
  });

  test('should handle zero beacons', () => {
    const result = calculatePrice(0, 100);
    expect(result).toEqual({
      basePrice: 0,
      discount: 0,
      totalPrice: 0,
      discountApplied: false,
    });
  });

  test('should handle negative price', () => {
    const result = calculatePrice(5, -10);
    expect(result).toEqual({
      basePrice: 0,
      discount: 0,
      totalPrice: 0,
      discountApplied: false,
    });
  });
});

describe('formatPrice', () => {
  test('should format price with default currency symbol', () => {
    expect(formatPrice(10)).toEqual('$10.00');
    expect(formatPrice(10.5)).toEqual('$10.50');
    expect(formatPrice(10.55)).toEqual('$10.55');
    expect(formatPrice(10.555)).toEqual('$10.55'); // Rounds to 2 decimal places
  });

  test('should format price with custom currency symbol', () => {
    expect(formatPrice(10, '€')).toEqual('€10.00');
    expect(formatPrice(10.5, '£')).toEqual('£10.50');
  });

  test('should handle zero price', () => {
    expect(formatPrice(0)).toEqual('$0.00');
  });

  test('should handle negative price', () => {
    expect(formatPrice(-10)).toEqual('$-10.00');
  });
});
