import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/types';
import { fetchMiddleware } from '../../services/fetchMiddleware';

// Define the state shape
interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Create a slice with reducers and actions
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Request actions
    fetchUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Select user actions
    selectUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    selectUserSuccess: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
      state.loading = false;
    },
    selectUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export actions
export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  selectUserRequest,
  selectUserSuccess,
  selectUserFailure,
} = userSlice.actions;

// Thunk for fetching users
export const fetchUsers = () => async (dispatch: any) => {
  dispatch(fetchUsersRequest());
  try {
    await fetchMiddleware.initializeUsers();
    const users = await fetchMiddleware.fetchAllUsers();
    dispatch(fetchUsersSuccess(users));
  } catch (error) {
    dispatch(fetchUsersFailure('Failed to fetch users. Please try again.'));
  }
};

// Thunk for selecting a user
export const selectUser = (userId: number) => async (dispatch: any) => {
  dispatch(selectUserRequest());
  try {
    const user = await fetchMiddleware.fetchUserById(userId);
    if (user) {
      dispatch(selectUserSuccess(user));
    } else {
      dispatch(selectUserFailure('User not found'));
    }
  } catch (error) {
    dispatch(selectUserFailure('Failed to fetch user details'));
  }
};

// Export reducer
export default userSlice.reducer;