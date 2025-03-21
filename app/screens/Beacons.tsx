import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { fetchUserExperiment, fetchBeaconPrice } from '../services/api'; // Import the required functions
import { NavigationProps, Order, User } from '../types/types';
import { getTotalPrice } from '../data/Price';
import { useUserContext } from '../contexts/UserContext';

const Beacons = (props: NavigationProps<'Beacons'>) => {
  const [beaconCount, setBeaconCount] = useState<number>(1);
  const [price, setPrice] = useState<number>(0); // State to hold the fetched price
  const { getUser, setDeliveryAddress } = useUserContext();
  const userId = props.route.params.userId;
  const user = getUser(userId) as User;

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        // Use Promise.all to fetch both data in parallel
        const [experimentData, priceData] = await Promise.all([
          fetchUserExperiment(String(user.id)),
          fetch(
            'https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice',
          ).then(res => res.json()),
        ]);

        const variant = experimentData.experiments.find(
          exp => exp.experiment === 'beacon_price',
        )?.variant;

        if (variant) {
          const priceInfo:
            | ({ country_id: string } & { [key: string]: number })
            | undefined = priceData.find(
            (item: { country_id: string }) =>
              item.country_id === user.country_id,
          );
          if (!priceInfo) {
            throw new Error(
              `No price info found for country_id: ${user.country_id}`,
            );
          }

          // Check if the variant key is valid
          if (
            ['price_control', 'price_variant1', 'price_variant2'].includes(
              variant,
            )
          ) {
            const fetchedPrice = priceInfo[variant];
            setPrice(fetchedPrice);
          } else {
            throw new Error(`Unknown variant: ${variant}`);
          }
        } else {
          throw new Error('No variant found for beacon_price experiment');
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPriceData();
  }, [user.id, user.country_id]); // Use country_id

  // Calculate discount and total price
  const basePrice = beaconCount * price;
  const discount = beaconCount >= 5 ? basePrice * 0.15 : 0;
  const totalPrice = getTotalPrice(beaconCount, price);

  const order: Order = {
    beacons: beaconCount,
    discount: discount,
    price: totalPrice,
    deliveryAddress: {
      name: user.full_name || '',
      address: user.address1 || '',
      address2: user.address2 || undefined,
      postalCode: user.postal_code?.toString() || '',
      city: user.city || '',
      country: user.country_name,
    },
  };

  const incrementBeaconCount = () => {
    setBeaconCount(beaconCount + 1);
  };

  const decrementBeaconCount = () => {
    if (beaconCount > 1) {
      setBeaconCount(beaconCount - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter number of beacons:</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity
          onPress={decrementBeaconCount}
          style={styles.counterButton}>
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{beaconCount}</Text>
        <TouchableOpacity
          onPress={incrementBeaconCount}
          style={styles.counterButton}>
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
        onPress={() => {
          props.navigation.navigate('Delivery', {
            order,
            userId
          });
        }}
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
  },
  counterText: {
    fontSize: 20,
  },
  counterValue: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  buttonContainer: {
    width: '80%',
  },
  priceContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
});

export default Beacons;
