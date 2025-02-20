import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { fetchUserExperiment, fetchBeaconPrice } from '../services/api'; // Import the required functions
import { NavigationProps, Order, User } from '../types/types';

const Beacons = (props: NavigationProps<'Beacons'>) => {
  const [beaconCount, setBeaconCount] = useState<number>(1);
  const [price, setPrice] = useState<number>(0); // State to hold the fetched price
  const user = props.route.params.getUser();

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const experimentData = await fetchUserExperiment(String(user.id)); // Convert user.id to string
        const variant = experimentData.experiments.find(
          exp => exp.experiment === 'beacon_price',
        )?.variant;
        if (variant) {
          const fetchedPrice = await fetchBeaconPrice(user.country_id, variant); // Use country_id instead of country_code
          setPrice(fetchedPrice);
        } else {
          throw new Error('No variant found for beacon_price experiment');
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPriceData();
  }, [user.id, user.country_id]); // Use country_id

  const order: Order = {
    beacons: beaconCount,
    discount: 0,
    price: beaconCount * price,
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
      <Button
        title="Buy"
        onPress={() => {
          props.navigation.navigate('Delivery', {
            order,
            getUser: props.route.params.getUser,
            setDeliveryAddress: props.route.params.setDeliveryAddress,
            getOrder: () => order,
            getDeliveryAddress: () => order.deliveryAddress,
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
});

export default Beacons;
