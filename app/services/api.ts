import { ExperimentData } from '../types/types';

/**
 * Information about beacon prices for a specific country
 */
export type BeaconPrice = {
  country_id: string;
  price_control: number;
  price_variant1: number;
  price_variant2: number;
  currency: string;
  id: string;
};

// Define the possible variant keys
type PriceVariant = 'control' | 'variant1' | 'variant2';
type PriceKey = `price_${PriceVariant}`;

// Guard function to check if the string is a valid price variant
function isPriceVariant(variant: string): variant is PriceVariant {
  return ['control', 'variant1', 'variant2'].includes(variant);
}

// Convert a variant name to a price key
function variantToPriceKey(variant: PriceVariant): PriceKey {
  return `price_${variant}` as PriceKey;
}

export const fetchUserExperiment = async (
  userId: string,
): Promise<ExperimentData> => {
  try {
    const response = await fetch(
      `https://6548fde7dd8ebcd4ab240284.mockapi.io/user_experiments/${userId}`,
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch user experiment: ${response.statusText}`,
      );
    }
    const data: ExperimentData = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the price of a beacon for a given country and experiment variant
 * @param countryId The country ID to get the price for
 * @param variant The experiment variant (control, variant1, or variant2)
 * @returns The price as a number
 */
export const fetchBeaconPrice = async (
  countryId: string,
  variant: string,
): Promise<number> => {
  try {
    // Validate the variant before making the API call
    if (!isPriceVariant(variant)) {
      throw new Error(
        `Invalid experiment variant: ${variant}. Expected 'control', 'variant1', or 'variant2'`,
      );
    }

    const response = await fetch(
      'https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice',
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch beacon price: ${response.statusText}`);
    }

    const data: BeaconPrice[] = await response.json();

    // Find price info for the specified country
    const priceInfo = data.find(item => item.country_id === countryId);
    if (!priceInfo) {
      throw new Error(`No price information found for country: ${countryId}`);
    }

    // Convert variant to price key and get the price
    const priceKey = variantToPriceKey(variant);
    const price = priceInfo[priceKey];

    if (typeof price !== 'number' || isNaN(price)) {
      throw new Error(
        `Invalid price value for ${countryId}/${variant}: ${price}`,
      );
    }

    return price;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching beacon price: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching beacon price');
  }
};
