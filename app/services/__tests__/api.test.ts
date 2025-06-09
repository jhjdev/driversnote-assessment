import { fetchUserExperiment, fetchBeaconPrice } from '../api';
import { ExperimentData, BeaconPrice } from '../../types/types';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('API Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchUserExperiment', () => {
    const mockExperimentData: ExperimentData = {
      experiments: [
        { experiment: 'beacon_price', variant: 'price_variant1' },
        { experiment: 'offer_expires_soon_at_checkout', variant: 'true' },
      ],
      user_id: '1',
    };

    it('should fetch user experiment data successfully', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockExperimentData));

      const result = await fetchUserExperiment('1');

      expect(result.experiments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            experiment: 'beacon_price',
            variant: 'price_variant1',
          }),
          expect.objectContaining({
            experiment: 'offer_expires_soon_at_checkout',
            variant: 'true',
          }),
        ]),
      );
      expect(fetchMock).toHaveBeenCalledWith(
        'https://6548fde7dd8ebcd4ab240284.mockapi.io/user_experiments/1',
      );
    });

    it('should throw an error when the API call fails', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      await expect(fetchUserExperiment('1')).rejects.toThrow('Network error');
    });

    it('should throw an error when the response is not ok', async () => {
      fetchMock.mockResponseOnce('', { status: 404, statusText: 'Not Found' });

      await expect(fetchUserExperiment('1')).rejects.toThrow(
        'Failed to fetch user experiment: Not Found',
      );
    });
  });

  describe('fetchBeaconPrice', () => {
    const mockPriceData: BeaconPrice[] = [
      {
        country_id: 'us',
        price_control: 10,
        price_variant1: 12,
        price_variant2: 8,
        currency: 'USD',
        id: '1',
      },
    ];

    it('should fetch beacon price successfully for control variant', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockPriceData));

      const price = await fetchBeaconPrice('us', 'control');

      expect(price).toBe(10);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice',
      );
    });

    it('should fetch beacon price successfully for variant1', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockPriceData));

      const price = await fetchBeaconPrice('us', 'variant1');

      expect(price).toBe(12);
    });

    it('should fetch beacon price successfully for variant2', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockPriceData));

      const price = await fetchBeaconPrice('us', 'variant2');

      expect(price).toBe(8);
    });

    it('should throw an error for invalid variant', async () => {
      await expect(fetchBeaconPrice('us', 'invalid')).rejects.toThrow(
        "Invalid experiment variant: invalid. Expected 'control', 'variant1', or 'variant2'",
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should throw an error when country is not found', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(mockPriceData));

      await expect(fetchBeaconPrice('unknown', 'control')).rejects.toThrow(
        'No price information found for country: unknown',
      );
    });

    it('should throw an error when the API call fails', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      await expect(fetchBeaconPrice('us', 'control')).rejects.toThrow(
        'Error fetching beacon price: Network error',
      );
    });

    it('should throw an error when the response is not ok', async () => {
      fetchMock.mockResponseOnce('', { status: 404, statusText: 'Not Found' });

      await expect(fetchBeaconPrice('us', 'control')).rejects.toThrow(
        'Error fetching beacon price: Failed to fetch beacon price: Not Found',
      );
    });

    it('should throw an error when price value is invalid', async () => {
      const invalidPriceData: BeaconPrice[] = [
        {
          country_id: 'us',
          price_control: 'invalid' as unknown as number,
          price_variant1: 12,
          price_variant2: 8,
          currency: 'USD',
          id: '1',
        },
      ];
      fetchMock.mockResponseOnce(JSON.stringify(invalidPriceData));

      await expect(fetchBeaconPrice('us', 'control')).rejects.toThrow(
        'Error fetching beacon price: Invalid price value for us/control: invalid',
      );
    });
  });
});
