type PriceInfo = {
  country: string;
  variant: string;
  price: number;
};

const minBeaconsForDiscount = 5; // Define the minimum beacons for discount
const discountPercent = 0.15; // Define the discount percent

export const getTotalPrice = (beacons: number, singlePrice: number) => {
  const basePrice = beacons * singlePrice;
  const discount =
    beacons >= minBeaconsForDiscount ? basePrice * discountPercent : 0;
  return basePrice - discount;
};

export const fetchUserExperiment = async (userId: string) => {
  const response = await fetch(
    `https://6548fde7dd8ebcd4ab240284.mockapi.io/user_experiments/${userId}`,
  );
  return response.json();
};

export const fetchBeaconPrice = async (country: string, variant: string) => {
  const response = await fetch(
    'https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice',
  );
  const data: PriceInfo[] = await response.json();
  return data.find(
    priceInfo => priceInfo.country === country && priceInfo.variant === variant,
  )?.price;
};
