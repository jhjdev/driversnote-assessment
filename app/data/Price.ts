/**
 * Types related to price calculation
 */
export interface PriceInfo {
  country: string;
  variant: string;
  price: number;
}

/**
 * Price calculation result object
 */
export interface PriceCalculation {
  basePrice: number;
  discount: number;
  totalPrice: number;
  discountApplied: boolean;
}

/**
 * The minimum number of beacons required to qualify for a discount
 */
export const MIN_BEACONS_FOR_DISCOUNT = 5;

/**
 * The discount percentage applied when purchasing minimum required beacons
 * Represented as a decimal value (0.15 = 15%)
 */
export const DISCOUNT_PERCENT = 0.15;

/**
 * Calculates the total price for a beacon order
 *
 * @param beacons - The number of beacons being purchased
 * @param singlePrice - The price of a single beacon
 * @param userDiscountPercent - The user's individual discount percentage (0-100)
 * @returns The total price after applying any applicable discounts
 */
export const getTotalPrice = (
  beacons: number,
  singlePrice: number,
  userDiscountPercent: number = 0,
): number => {
  if (beacons <= 0 || singlePrice < 0) {
    return 0;
  }

  const basePrice = beacons * singlePrice;

  // Apply user-specific discount if they have one
  let discount = 0;
  if (userDiscountPercent > 0) {
    discount = basePrice * (userDiscountPercent / 100);
  } else if (beacons >= MIN_BEACONS_FOR_DISCOUNT) {
    // Fall back to quantity-based discount if no user discount
    discount = basePrice * DISCOUNT_PERCENT;
  }

  return parseFloat((basePrice - discount).toFixed(2));
};

/**
 * Calculates detailed price information including base price, discount, and total
 *
 * @param beacons - The number of beacons being purchased
 * @param singlePrice - The price of a single beacon
 * @param userDiscountPercent - The user's individual discount percentage (0-100)
 * @returns An object containing detailed price calculation information
 */
export const calculatePrice = (
  beacons: number,
  singlePrice: number,
  userDiscountPercent: number = 0,
): PriceCalculation => {
  if (beacons <= 0 || singlePrice < 0) {
    return {
      basePrice: 0,
      discount: 0,
      totalPrice: 0,
      discountApplied: false,
    };
  }

  const basePrice = beacons * singlePrice;

  // Determine discount and whether it's applied
  let discount = 0;
  let discountApplied = false;

  if (userDiscountPercent > 0) {
    // User has a specific discount
    discount = parseFloat((basePrice * (userDiscountPercent / 100)).toFixed(2));
    discountApplied = true;
  } else if (beacons >= MIN_BEACONS_FOR_DISCOUNT) {
    // Quantity-based discount
    discount = parseFloat((basePrice * DISCOUNT_PERCENT).toFixed(2));
    discountApplied = true;
  }

  const totalPrice = parseFloat((basePrice - discount).toFixed(2));

  return {
    basePrice,
    discount,
    totalPrice,
    discountApplied,
  };
};

/**
 * Formats a price value with the appropriate currency symbol
 *
 * @param price - The price value to format
 * @param currencySymbol - The currency symbol to use (defaults to "$")
 * @returns A formatted price string
 */
export const formatPrice = (
  price: number,
  currencySymbol: string = '$',
): string => {
  return `${currencySymbol}${price.toFixed(2)}`;
};
