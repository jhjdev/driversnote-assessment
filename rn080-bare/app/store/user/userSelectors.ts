import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

// Basic selectors
export const selectUserState = (state: RootState) => state.user;
export const selectUsers = (state: RootState) => state.user.users;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Memoized selectors
export const selectUserById = createSelector(
  [selectUsers, (state: RootState, userId: string | number) => userId],
  (users, userId) => users.find(user => user.id.toString() === userId.toString()) || null
);

// Selector for user count
export const selectUserCount = createSelector(
  selectUsers,
  (users) => users.length
);

// Selector for users sorted by name
export const selectUsersSortedByName = createSelector(
  selectUsers,
  (users) => [...users].sort((a, b) => {
    const nameA = a.full_name || '';
    const nameB = b.full_name || '';
    return nameA.localeCompare(nameB);
  })
);

// Selector for users filtered by country
export const selectUsersByCountry = createSelector(
  [selectUsers, (state: RootState, countryId: string) => countryId],
  (users, countryId) => users.filter(user => user.country_id === countryId)
);