import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import rootReducer from './rootReducer';
import { apiSlice } from '../services/api/apiSlice';

// Create Redux store using Redux Toolkit's configureStore
const store = configureStore({
  reducer: {
    ...rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Define AppDispatch type for use with useDispatch
export type AppDispatch = typeof store.dispatch;

// Define RootState type from the store itself
export type RootState = ReturnType<typeof store.getState>;

export default store;