/**
 * Utility functions for price calculations
 */

export const isPriceVariant = (variant: string): boolean => {
  return ['variant1', 'variant2', 'variant3'].includes(variant);
};

export const variantToPriceKey = (variant: string): string => {
  switch (variant) {
    case 'variant1':
      return 'price_variant1';
    case 'variant2':
      return 'price_variant2';
    case 'variant3':
      return 'price_variant3';
    default:
      throw new Error(`Unknown price variant: ${variant}`);
  }
};
