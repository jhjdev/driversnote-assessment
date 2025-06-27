import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  ActivityIndicator,
  Divider,
  Surface,
  useTheme,
  Avatar,
  Chip,
} from 'react-native-paper';
import { RootState } from '../store/store';
import { calculatePrice, formatPrice } from '../data/Price';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../context/ThemeContext';
import { commonStyles, counterStyles, priceStyles, userCardStyles, errorStyles, textStyles, createThemedStyles } from '../styles';

interface BeaconsScreenProps {
  route: RouteProp<{ params: { userId: number } }, 'params'>;
}

type BeaconsNavigationProp = StackNavigationProp<{ Delivery: { order: any; userId: number } }, 'Delivery'>;

const Beacons: React.FC<BeaconsScreenProps> = ({ route }) => {
  const [beaconCount, setBeaconCount] = useState<number>(1);
  const navigation = useNavigation<BeaconsNavigationProp>();
  const userId = route.params.userId;

  const { selectedUser, loading, error } = useSelector((state: RootState) => state.user);
  const user = selectedUser;

  const price = 10.0; // Default price
  const userDiscountPercent = user?.discount || 0; // Get user's discount percentage

  const incrementBeaconCount = () => setBeaconCount(beaconCount + 1);
  const decrementBeaconCount = () => {
    if (beaconCount > 1) {
      setBeaconCount(beaconCount - 1);
    }
  };

  // Calculate price using user's specific discount
  const priceCalculation = calculatePrice(beaconCount, price, userDiscountPercent);
  const { basePrice, discount, totalPrice, discountApplied } = priceCalculation;

  const order = {
    beacons: beaconCount,
    discount,
    price: totalPrice,
    deliveryAddress: {
      name: user?.full_name || '',
      address: user?.address1 || '',
      address2: user?.address2 || undefined,
      postalCode: user?.postal_code?.toString() || '',
      city: user?.city || '',
      country: user?.country_name || '',
    },
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.errorContainer}>
        <Card style={errorStyles.card}>
          <Card.Content>
            <Title>Error</Title>
            <Paragraph>An error occurred while fetching user data</Paragraph>
            <Button mode="contained" onPress={() => navigation.goBack()} style={commonStyles.button}>
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={commonStyles.errorContainer}>
        <Card style={errorStyles.card}>
          <Card.Content>
            <Title>User Not Found</Title>
            <Paragraph>User not found</Paragraph>
            <Button mode="contained" onPress={() => navigation.goBack()} style={commonStyles.button}>
              Go Back
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 20 : 0 }}>
        <ScrollView style={commonStyles.container}>
      {/* User Info Card */}
      <Card style={commonStyles.smallCard}>
        <Card.Content>
          <View style={userCardStyles.header}>
            <Avatar.Text size={48} label={user?.full_name?.[0] || 'U'} style={userCardStyles.avatar} />
            <View style={userCardStyles.info}>
              <Title>{user?.full_name}</Title>
              <Paragraph>{user?.email}</Paragraph>
              {userDiscountPercent > 0 && (
                <Chip icon="tag" style={userCardStyles.discountChip} textStyle={userCardStyles.discountChipText}>
                  {userDiscountPercent}% Discount
                </Chip>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Order Card */}
      <Card style={commonStyles.card}>
        <Card.Content>
          <Title>Select Beacon Quantity</Title>
          <Paragraph>Choose the number of iBeacons for your order</Paragraph>

          <View style={counterStyles.container}>
            <IconButton
              icon="minus"
              onPress={decrementBeaconCount}
              size={28}
              style={counterStyles.button}
              disabled={beaconCount <= 1}
            />
            <Surface style={counterStyles.display}>
              <Text style={counterStyles.value}>{beaconCount}</Text>
              <Text style={counterStyles.label}>beacon{beaconCount !== 1 ? 's' : ''}</Text>
            </Surface>
            <IconButton
              icon="plus"
              onPress={incrementBeaconCount}
              size={28}
              style={counterStyles.button}
            />
          </View>

          <Divider style={commonStyles.divider} />

          <Surface style={priceStyles.container}>
            <View style={priceStyles.row}>
              <Paragraph>Unit Price:</Paragraph>
              <Paragraph style={priceStyles.value}>{formatPrice(price)}</Paragraph>
            </View>
            <View style={priceStyles.row}>
              <Paragraph>Quantity:</Paragraph>
              <Paragraph style={priceStyles.value}>{beaconCount}</Paragraph>
            </View>
            <View style={priceStyles.row}>
              <Paragraph>Subtotal:</Paragraph>
              <Paragraph style={priceStyles.value}>{formatPrice(basePrice)}</Paragraph>
            </View>
            {discountApplied && (
              <View style={priceStyles.row}>
                <Paragraph style={priceStyles.discount}>
                  Discount ({userDiscountPercent > 0 ? `${userDiscountPercent}%` : '15%'}):
                </Paragraph>
                <Paragraph style={[priceStyles.value, priceStyles.discount]}>-{formatPrice(discount)}</Paragraph>
              </View>
            )}
            <Divider style={commonStyles.smallDivider} />
            <View style={priceStyles.row}>
              <Title>Total:</Title>
              <Title style={priceStyles.total}>{formatPrice(totalPrice)}</Title>
            </View>
          </Surface>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Delivery', { order, userId })}
            style={commonStyles.button}
            icon="cart"
            contentStyle={commonStyles.buttonContent}
          >
            Continue to Delivery
          </Button>
        </Card.Content>
      </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Beacons;
