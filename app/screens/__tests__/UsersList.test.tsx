import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UsersList from '../UsersList';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../contexts/UserContext';

// Mock the navigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock the user context
jest.mock('../../contexts/UserContext', () => ({
  useUserContext: jest.fn(),
}));

describe('UsersList Screen', () => {
  const mockNavigate = jest.fn();
  const mockGetUser = jest.fn();
  const mockSetDeliveryAddress = jest.fn();

  beforeEach(() => {
    // Setup navigation mock
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    // Setup user context mock
    (useUserContext as jest.Mock).mockReturnValue({
      getUser: mockGetUser,
      setDeliveryAddress: mockSetDeliveryAddress,
    });

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the screen title', () => {
    const { getByText } = render(<UsersList />);
    expect(getByText('Select a User')).toBeTruthy();
  });

  it('renders the list of users', () => {
    const { getByText } = render(<UsersList />);

    // Check if some known user names are rendered
    expect(getByText('Karmen Fadel')).toBeTruthy();
    expect(getByText('Lasonya Dietrich Sr.')).toBeTruthy();
    expect(getByText('Ada Stiedemann')).toBeTruthy();
  });

  it('navigates to Beacons screen when a user is selected', () => {
    const { getAllByText } = render(<UsersList />);

    // Find and press the first "Select" button
    const selectButtons = getAllByText('Select');
    fireEvent.press(selectButtons[0]);

    // Check if navigation was called with correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('Beacons', {
      userId: '1',
    });
  });

  it('renders user information correctly', () => {
    const { getByText } = render(<UsersList />);

    // Check if user details are rendered correctly
    const user = getByText('Karmen Fadel');
    expect(user).toBeTruthy();

    // Check if address is rendered
    expect(getByText('546 Collin Vista')).toBeTruthy();
    expect(getByText('Quebec')).toBeTruthy();
    expect(getByText('Canada')).toBeTruthy();
  });

  it('handles users with missing information gracefully', () => {
    const { getByText } = render(<UsersList />);

    // Check if user with missing information is rendered
    const user = getByText('Ada Stiedemann');
    expect(user).toBeTruthy();

    // The component should handle null values for address, city, etc.
    const userBox = user.parent?.parent;
    expect(userBox).toBeTruthy();
  });
});
