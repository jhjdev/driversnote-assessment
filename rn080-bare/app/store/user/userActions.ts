import { User } from '../../types/types';
import { fetchMiddleware } from '../../services/fetchMiddleware';
import { AppDispatch } from '../store';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  SELECT_USER_REQUEST,
  SELECT_USER_SUCCESS,
  SELECT_USER_FAILURE,
  UserActionTypes,
} from './userReducer';

// Action creators for fetching users
const fetchUsersRequest = (): UserActionTypes => ({
  type: FETCH_USERS_REQUEST,
});

const fetchUsersSuccess = (users: User[]): UserActionTypes => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

const fetchUsersFailure = (error: string): UserActionTypes => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

// Action creators for selecting a user
const selectUserRequest = (): UserActionTypes => ({
  type: SELECT_USER_REQUEST,
});

const selectUserSuccess = (user: User): UserActionTypes => ({
  type: SELECT_USER_SUCCESS,
  payload: user,
});

const selectUserFailure = (error: string): UserActionTypes => ({
  type: SELECT_USER_FAILURE,
  payload: error,
});

// Thunk for fetching users
export const fetchUsers = () => async (dispatch: AppDispatch) => {
  dispatch(fetchUsersRequest());
  try {
    // Initialize users collection if needed (similar to UserContext)
    await fetchMiddleware.initializeUsers();

    const users = await fetchMiddleware.fetchAllUsers();
    dispatch(fetchUsersSuccess(users));
  } catch (error) {
    dispatch(fetchUsersFailure('Failed to fetch users. Please try again.'));
  }
};

// Thunk for selecting a user by ID
export const selectUser = (userId: number) => async (dispatch: AppDispatch) => {
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
