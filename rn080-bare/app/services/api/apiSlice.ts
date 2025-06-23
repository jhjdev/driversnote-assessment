import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, ExperimentData, BeaconPrice } from '../../types/types';
import { isPriceVariant, variantToPriceKey } from '../api';
import { fetchMiddleware } from '../fetchMiddleware';

// Define our API service using RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/' // This will be overridden in endpoints that need different base URLs
  }),
  tagTypes: ['User', 'Experiment', 'BeaconPrice'],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<User[], void>({
      queryFn: async (_, { dispatch }) => {
        try {
          // We're using our existing middleware for now, but this could be replaced
          // with direct MongoDB calls or other API calls in the future
          const users = await fetchMiddleware.fetchAllUsers();
          return { data: users };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: 'Failed to fetch users' 
            } 
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    
    // Get user by ID
    getUserById: builder.query<User, number>({
      queryFn: async (userId, { dispatch }) => {
        try {
          const user = await fetchMiddleware.fetchUserById(userId);
          if (!user) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: `User with ID ${userId} not found` 
              } 
            };
          }
          return { data: user };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: `Failed to fetch user with ID ${userId}` 
            } 
          };
        }
      },
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    // Get user experiment data
    getUserExperiment: builder.query<ExperimentData, string>({
      query: (userId) => ({
        url: `https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/experiments/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'Experiment', id: userId }],
    }),
    
    // Get beacon prices
    getBeaconPrices: builder.query<BeaconPrice[], void>({
      query: () => ({
        url: 'https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice',
        method: 'GET',
      }),
      providesTags: [{ type: 'BeaconPrice', id: 'LIST' }],
    }),
    
    // Get beacon price for specific user
    getUserBeaconPrice: builder.query<number, { userId: string, countryId: string }>({
      async queryFn({ userId, countryId }, { dispatch, getState }, _extraOptions, fetchWithBQ) {
        try {
          // Get user experiment data
          const experimentResult = await fetchWithBQ(`https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/experiments/${userId}`);
          if (experimentResult.error) {
            return { error: experimentResult.error };
          }
          
          const experimentData = experimentResult.data as ExperimentData;
          const variant = experimentData.experiments.find(
            exp => exp.experiment === 'beacon_price'
          )?.variant;
          
          if (!variant) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'No variant found for beacon_price experiment' 
              } 
            };
          }
          
          // Get price data
          const priceResult = await fetchWithBQ('https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice');
          if (priceResult.error) {
            return { error: priceResult.error };
          }
          
          const priceData = priceResult.data as BeaconPrice[];
          const priceInfo = priceData.find(item => item.country_id === countryId);
          
          if (!priceInfo) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: `No price info found for country_id: ${countryId}` 
              } 
            };
          }
          
          // Determine which price to use based on variant
          const priceKey = isPriceVariant(variant) 
            ? variantToPriceKey(variant) 
            : 'price_control';
            
          const price = priceInfo[priceKey as keyof BeaconPrice] as number;
          
          return { data: price };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: 'Failed to fetch price data' 
            } 
          };
        }
      },
      providesTags: (result, error, arg) => [
        { type: 'BeaconPrice', id: arg.countryId },
        { type: 'Experiment', id: arg.userId }
      ],
    }),
  }),
});


// Export generated hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserExperimentQuery,
  useGetBeaconPricesQuery,
  useGetUserBeaconPriceQuery,
} = apiSlice;