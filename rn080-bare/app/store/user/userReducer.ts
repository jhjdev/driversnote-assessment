import { User } from '../../types/types';

// Define action types
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const SELECT_USER_REQUEST = 'SELECT_USER_REQUEST';
export const SELECT_USER_SUCCESS = 'SELECT_USER_SUCCESS';
export const SELECT_USER_FAILURE = 'SELECT_USER_FAILURE';

// Define state shape
export interface UserState {
  loading: boolean;
  users: User[];
  selectedUser: User | null;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  users: [],
  selectedUser: null,
  error: null,
};

// Define actions
interface FetchUsersRequestAction {
  type: typeof FETCH_USERS_REQUEST;
}

interface FetchUsersSuccessAction {
  type: typeof FETCH_USERS_SUCCESS;
  payload: User[];
}

interface FetchUsersFailureAction {
  type: typeof FETCH_USERS_FAILURE;
  payload: string;
}

interface SelectUserRequestAction {
  type: typeof SELECT_USER_REQUEST;
}

interface SelectUserSuccessAction {
  type: typeof SELECT_USER_SUCCESS;
  payload: User;
}

interface SelectUserFailureAction {
  type: typeof SELECT_USER_FAILURE;
  payload: string;
}

export type UserActionTypes =
  | FetchUsersRequestAction
  | FetchUsersSuccessAction
  | FetchUsersFailureAction
  | SelectUserRequestAction
  | SelectUserSuccessAction
  | SelectUserFailureAction;

// Reducer
const userReducer = (state = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SELECT_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case SELECT_USER_SUCCESS:
      return { ...state, loading: false, selectedUser: action.payload };
    case SELECT_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;