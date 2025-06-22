import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// This RootState type will be used throughout the app
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;