import { ExperimentData, User } from '../types/types';

export type PriceInfo = {
  country_id: string;
  price_control: number;
  price_variant1: number;
  price_variant2: number;
  currency: string;
  id: string;
};

export type BeaconPrice = {
  country_id: string;
  price_control: number;
  price_variant1: number;
  price_variant2: number;
  currency: string;
  id: string;
};

// Define the possible variant keys
type PriceKeys = 'price_control' | 'price_variant1' | 'price_variant2';

// Guard function to check if the key is valid
function isPriceKey(key: string): key is PriceKeys {
  return ['price_control', 'price_variant1', 'price_variant2'].includes(key);
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
    console.error('Error in fetchUserExperiment:', error);
    throw error;
  }
};

export const fetchBeaconPrice = async (
  countryId: string,
  variant: string,
): Promise<number> => {
  try {
    const response = await fetch(
      'https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice',
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch beacon price: ${response.statusText}`);
    }
    const data: BeaconPrice[] = await response.json();
    console.log('Fetched Beacon Price Data:', data);

    const priceInfo = data.find(item => item.country_id === countryId);
    if (!priceInfo) {
      throw new Error(`No price info found for country_id: ${countryId}`);
    }
    console.log('Found price info:', priceInfo);

    // Use variant directly as it already contains 'price_' prefix
    const key = variant;
    console.log('Constructed key:', key); // Add this line to log the constructed key

    if (!isPriceKey(key)) {
      throw new Error(`Unknown variant: ${key}`); // Change this line to log the full key
    }

    const price = priceInfo[key];
    console.log('Returning price:', price);
    return price;
  } catch (error) {
    console.error('Error in fetchBeaconPrice:', error);
    throw error;
  }
};

export const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(
      `https://6548fde7dd8ebcd4ab240284.mockapi.io/users/${userId}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchUser:', error);
    throw error;
  }
};
