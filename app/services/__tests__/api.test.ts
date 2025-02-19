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
    const variant = 'price_control';
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
    const variant = 'price_control';

    fetchMock.mockResponseOnce(JSON.stringify([]));

    await expect(fetchBeaconPrice(countryId, variant)).rejects.toThrow(
      'No price info found for country_id: unknown',
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice`,
    );
  });
});
