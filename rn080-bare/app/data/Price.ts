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
 * @returns The total price after applying any applicable discounts
 */
export const getTotalPrice = (beacons: number, singlePrice: number): number => {
  if (beacons <= 0 || singlePrice < 0) {
    return 0;
  }

  const basePrice = beacons * singlePrice;
  const discount =
    beacons >= MIN_BEACONS_FOR_DISCOUNT ? basePrice * DISCOUNT_PERCENT : 0;

  return parseFloat((basePrice - discount).toFixed(2));
};

/**
 * Calculates detailed price information including base price, discount, and total
 *
 * @param beacons - The number of beacons being purchased
 * @param singlePrice - The price of a single beacon
 * @returns An object containing detailed price calculation information
 */
export const calculatePrice = (
  beacons: number,
  singlePrice: number,
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
  const discountApplied = beacons >= MIN_BEACONS_FOR_DISCOUNT;
  const discount = discountApplied
    ? parseFloat((basePrice * DISCOUNT_PERCENT).toFixed(2))
    : 0;
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
