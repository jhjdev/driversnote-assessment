import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList, Order } from '../types/types';
import { getTotalPrice } from '../data/Price';
import { useGetUserByIdQuery, useGetUserBeaconPriceQuery } from '../services/api/apiSlice';

interface BeaconsScreenProps {
  route: RouteProp<RootStackParamList, 'Beacons'>;
}

const Beacons: React.FC<BeaconsScreenProps> = ({ route }) => {
  const [beaconCount, setBeaconCount] = useState<number>(1);
  const navigation = useNavigation();
  const userId = route.params.userId;

  // Use RTK Query hooks to fetch user and price data
  const { 
    data: user, 
    isLoading: isUserLoading, 
    error: userError 
  } = useGetUserByIdQuery(Number(userId));

  const { 
    data: price = 0, 
    isLoading: isPriceLoading, 
    error: priceError 
  } = useGetUserBeaconPriceQuery(
    { userId, countryId: user?.country_id || '' },
    { skip: !user?.country_id } // Skip this query if country_id is not available
  );

  const isLoading = isUserLoading || isPriceLoading;
  const error = userError || priceError;

  const incrementBeaconCount = () => setBeaconCount(beaconCount + 1);
  const decrementBeaconCount = () => {
    if (beaconCount > 1) setBeaconCount(beaconCount - 1);
  };

  // Calculate prices
  const basePrice = beaconCount * price;
  const discount = beaconCount >= 5 ? basePrice * 0.15 : 0;
  const totalPrice = getTotalPrice(beaconCount, price);

  // Prepare order object
  const order: Order = {
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>
          {error instanceof Error ? error.message : 'An error occurred while fetching data'}
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          containerStyle={styles.buttonContainer}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter number of beacons:</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity
          onPress={decrementBeaconCount}
          style={styles.counterButton}
        >
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{beaconCount}</Text>
        <TouchableOpacity
          onPress={incrementBeaconCount}
          style={styles.counterButton}
        >
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>Unit Price: ${price.toFixed(2)}</Text>
        <Text style={styles.priceText}>Quantity: {beaconCount}</Text>
        {discount > 0 && (
          <Text style={styles.discountText}>
            Discount (15%): -${discount.toFixed(2)}
          </Text>
        )}
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
      </View>

      <Button
        title="Buy"
        onPress={() =>
          navigation.navigate('Delivery', {
            order,
            userId,
          })
        }
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  counterText: {
    fontSize: 20,
  },
  counterValue: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  priceContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  priceText: {
    fontSize: 16,
    marginBottom: 5,
  },
  discountText: {
    fontSize: 16,
    marginBottom: 5,
    color: 'green',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default Beacons;