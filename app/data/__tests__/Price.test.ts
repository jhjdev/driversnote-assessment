import { getTotalPrice } from '../Price';

const minBeaconsForDiscount = 5; // Define the minimum beacons for discount
const discountPercent = 0.15; // Define the discount percent

test('getTotalPrice - no discount', () => {
  const result = getTotalPrice(3, 100);
  expect(result).toEqual(300);
});

test('getTotalPrice - with discount', () => {
  const result = getTotalPrice(6, 100);
  expect(result).toEqual(510); // 600 - 15% discount
});
