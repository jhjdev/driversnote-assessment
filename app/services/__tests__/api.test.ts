import { fetchUserExperiment, fetchBeaconPrice } from '../api';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('API Tests', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetchUserExperiment should return experiment data', async () => {
    const userId = '1';
    const mockResponse = {
      experiments: [{ experiment: 'beacon_price', variant: 'price_control' }],
      user_id: userId,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await fetchUserExperiment(userId);

    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://6548fde7dd8ebcd4ab240284.mockapi.io/user_experiments/${userId}`,
    );
  });

  it('fetchBeaconPrice should return price data', async () => {
    const countryId = 'us';
    const variant = 'control';
    const mockResponse = [
      {
        country_id: 'us',
        price_control: 10,
        price_variant1: 12,
        price_variant2: 8,
        currency: 'USD',
        id: '2',
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const price = await fetchBeaconPrice(countryId, variant);

    expect(price).toEqual(10);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice`,
    );
  });

  it('fetchBeaconPrice should throw an error if price info not found', async () => {
    const countryId = 'unknown';
    const variant = 'control';

    fetchMock.mockResponseOnce(JSON.stringify([]));

    await expect(fetchBeaconPrice(countryId, variant)).rejects.toThrow(
      'Error fetching beacon price: No price information found for country: unknown',
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice`,
    );
  });

  it('fetchBeaconPrice should throw an error for invalid variant', async () => {
    const countryId = 'us';
    const invalidVariant = 'invalid_variant';

    await expect(fetchBeaconPrice(countryId, invalidVariant)).rejects.toThrow(
      `Error fetching beacon price: Invalid experiment variant: ${invalidVariant}. Expected 'control', 'variant1', or 'variant2'`,
    );

    // API should not be called when variant is invalid
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetchBeaconPrice should handle API errors properly', async () => {
    const countryId = 'us';
    const variant = 'control';

    // Mock a server error response
    fetchMock.mockRejectOnce(new Error('Network error'));

    await expect(fetchBeaconPrice(countryId, variant)).rejects.toThrow(
      'Error fetching beacon price: Network error',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice`,
    );
  });
});
