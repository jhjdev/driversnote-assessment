import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Row, Separator } from '../Row';

describe('Row Component', () => {
  const mockOnPress = jest.fn();
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    onPress: mockOnPress,
  };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with all props', () => {
    const { getByText } = render(<Row {...defaultProps} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<Row {...defaultProps} />);

    fireEvent.press(getByText('Test Title'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders with correct styles', () => {
    const { getByText } = render(<Row {...defaultProps} />);
    const title = getByText('Test Title');
    const subtitle = getByText('Test Subtitle');

    expect(title.props.style).toMatchObject({
      fontSize: 18,
      fontWeight: '600',
      color: '#3a3a3a',
    });

    expect(subtitle.props.style).toMatchObject({
      color: '#666',
      fontSize: 16,
      marginTop: 2,
    });
  });
});

describe('Separator Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Separator />);
    const separator = getByTestId('separator');

    expect(separator.props.style).toMatchObject({
      backgroundColor: '#ececec',
      height: 1,
    });
  });
});
