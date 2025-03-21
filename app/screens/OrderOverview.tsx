import React, { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Text, Button, Overlay } from 'react-native-elements';
import { NavigationProps } from '../types/types';

const OrderOverview = (props: NavigationProps<'OrderOverview'>) => {
  const [isVisible, setVisible] = useState(false);
  const order = props.route.params.order;
  const deliveryAddress = props.route.params.deliveryAddress;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text h2 style={styles.title}>
          Order Overview
        </Text>

        <View style={styles.orderInfoSection}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ordered iBeacons:</Text>
            <Text style={styles.infoValue}>{String(order.beacons)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Discount:</Text>
            <Text style={styles.discountValue}>
              - ${String(order.discount.toFixed(2))}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Price:</Text>
            <Text style={styles.priceValue}>
              ${String(order.price.toFixed(2))}
            </Text>
          </View>
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.addressText}>{deliveryAddress.name}</Text>
          <Text style={styles.addressText}>
            {deliveryAddress.address}, {deliveryAddress.postalCode}
          </Text>
          <Text style={styles.addressText}>
            {deliveryAddress.city}, {deliveryAddress.country}
          </Text>
        </View>

        <Button
          title="Confirm and send the order"
          type="solid"
          buttonStyle={styles.confirmButton}
          containerStyle={styles.buttonContainer}
          onPress={() => {
            Alert.alert(
              'Order completed! 📦🚚',
              'You can now go back to the "select user" screen and place another order.',
              [
                {
                  text: 'OK',
                  onPress: () => props.navigation.navigate('Users'),
                },
              ],
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  orderInfoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'right',
  },
  discountValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e74c3c',
    textAlign: 'right',
  },
  addressText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 15,
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
  },
});

export default OrderOverview;
