import userReducer, {
  clearError,
  clearSelectedUser,
  setSelectedUser,
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  UserState,
} from '../store/user/userSlice';
import { User } from '../types/types';

// Mock the fetchMiddleware
jest.mock('../services/fetchMiddleware', () => ({
  fetchMiddleware: {
    fetchAllUsers: jest.fn(),
    fetchUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

describe('userSlice', () => {
  const initialState: UserState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  };

  const mockUser: User = {
    id: 1,
    full_name: 'John Doe',
    tag: 'premium',
    discount: 10,
    address1: '123 Main St',
    city: 'New York',
    country_name: 'USA',
  };

  const mockUsers: User[] = [
    mockUser,
    {
      id: 2,
      full_name: 'Jane Smith',
      tag: 'standard',
      address1: '456 Oak Ave',
      city: 'Los Angeles',
      country_name: 'USA',
    },
  ];

  describe('reducers', () => {
    it('should handle clearError', () => {
      const previousState: UserState = {
        ...initialState,
        error: 'Some error message',
      };

      const result = userReducer(previousState, clearError());

      expect(result.error).toBeNull();
      expect(result.users).toEqual(previousState.users);
      expect(result.selectedUser).toEqual(previousState.selectedUser);
      expect(result.loading).toEqual(previousState.loading);
    });

    it('should handle clearSelectedUser', () => {
      const previousState: UserState = {
        ...initialState,
        selectedUser: mockUser,
      };

      const result = userReducer(previousState, clearSelectedUser());

      expect(result.selectedUser).toBeNull();
      expect(result.users).toEqual(previousState.users);
      expect(result.error).toEqual(previousState.error);
      expect(result.loading).toEqual(previousState.loading);
    });

    it('should handle setSelectedUser', () => {
      const result = userReducer(initialState, setSelectedUser(mockUser));

      expect(result.selectedUser).toEqual(mockUser);
      expect(result.users).toEqual(initialState.users);
      expect(result.error).toEqual(initialState.error);
      expect(result.loading).toEqual(initialState.loading);
    });
  });

  describe('fetchUsers async thunk', () => {
    it('should handle fetchUsers.pending', () => {
      const action = { type: fetchUsers.pending.type };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fetchUsers.fulfilled', () => {
      const action = { type: fetchUsers.fulfilled.type, payload: mockUsers };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.users).toEqual(mockUsers);
      expect(result.error).toBeNull();
    });

    it('should handle fetchUsers.rejected', () => {
      const errorMessage = 'Failed to fetch users';
      const action = { type: fetchUsers.rejected.type, payload: errorMessage };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.users).toEqual([]);
    });
  });

  describe('createUser async thunk', () => {
    it('should handle createUser.fulfilled', () => {
      const previousState: UserState = {
        ...initialState,
        users: [mockUsers[1]], // Only second user initially
      };

      const action = { type: createUser.fulfilled.type, payload: mockUser };
      const result = userReducer(previousState, action);

      expect(result.loading).toBe(false);
      expect(result.users).toHaveLength(2);
      expect(result.users).toContain(mockUser);
      expect(result.error).toBeNull();
    });
  });

  describe('updateUser async thunk', () => {
    it('should handle updateUser.fulfilled', () => {
      const updatedUser: User = { ...mockUser, full_name: 'John Updated' };
      const previousState: UserState = {
        ...initialState,
        users: mockUsers,
        selectedUser: mockUser,
      };

      const action = { type: updateUser.fulfilled.type, payload: updatedUser };
      const result = userReducer(previousState, action);

      expect(result.loading).toBe(false);
      expect(result.users[0]).toEqual(updatedUser);
      expect(result.selectedUser).toEqual(updatedUser);
      expect(result.error).toBeNull();
    });

    it('should not update selectedUser if different user is updated', () => {
      const updatedUser: User = { ...mockUsers[1], full_name: 'Jane Updated' };
      const previousState: UserState = {
        ...initialState,
        users: mockUsers,
        selectedUser: mockUser, // Different user selected
      };

      const action = { type: updateUser.fulfilled.type, payload: updatedUser };
      const result = userReducer(previousState, action);

      expect(result.selectedUser).toEqual(mockUser); // Should remain unchanged
      expect(result.users[1]).toEqual(updatedUser);
    });
  });

  describe('deleteUser async thunk', () => {
    it('should handle deleteUser.fulfilled', () => {
      const previousState: UserState = {
        ...initialState,
        users: mockUsers,
      };

      const action = { type: deleteUser.fulfilled.type, payload: mockUser.id };
      const result = userReducer(previousState, action);

      expect(result.loading).toBe(false);
      expect(result.users).toHaveLength(1);
      expect(result.users).not.toContain(mockUser);
      expect(result.error).toBeNull();
    });

    it('should clear selectedUser if deleted user was selected', () => {
      const previousState: UserState = {
        ...initialState,
        users: mockUsers,
        selectedUser: mockUser,
      };

      const action = { type: deleteUser.fulfilled.type, payload: mockUser.id };
      const result = userReducer(previousState, action);

      expect(result.selectedUser).toBeNull();
      expect(result.users).not.toContain(mockUser);
    });

    it('should not clear selectedUser if different user is deleted', () => {
      const previousState: UserState = {
        ...initialState,
        users: mockUsers,
        selectedUser: mockUser,
      };

      const action = { type: deleteUser.fulfilled.type, payload: mockUsers[1].id };
      const result = userReducer(previousState, action);

      expect(result.selectedUser).toEqual(mockUser); // Should remain unchanged
      expect(result.users).toHaveLength(1);
      expect(result.users[0]).toEqual(mockUser);
    });
  });
});
