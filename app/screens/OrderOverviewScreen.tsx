import React from 'react';
import { View, ScrollView, Alert, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { Text, Card, Button, useTheme, Divider } from 'react-native-paper';
import { useNavigation, RouteProp, CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { createReceipt } from '../store/receipts/receiptsSlice';
import { formatPrice } from '../data/Price';
import { commonStyles } from '../styles';

interface OrderOverviewScreenProps {
  route: RouteProp<{ params: { order: any; userId: number } }, 'params'>;
}

export default function OrderOverviewScreen ({ route }: OrderOverviewScreenProps) {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { order, userId } = route.params;
  const { deliveryAddress } = order;

  const handleConfirmOrder = async () => {
    try {
      // Create receipt data in MongoDB format
      const receiptData = {
        userId,
        userName: deliveryAddress.name,
        beaconQuantity: order.beacons,
        discount: order.discount,
        deliveryAddress: `${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.postalCode}, ${deliveryAddress.country}`,
        totalPrice: order.price,
      };

      // Dispatch the receipt creation
      await dispatch(createReceipt(receiptData));

      Alert.alert(
        'Order Completed! 📦🚚',
        'Your order has been placed successfully. You can view the receipt in the Receipts tab.',
        [
          {
            text: 'View Receipts',
            onPress: () => {
              // Navigate to parent tab navigator first
              const parentNav = navigation.getParent();
              if (parentNav) {
                parentNav.navigate('Receipts');
              }
            },
          },
          {
            text: 'Back to Users',
            onPress: () => {
              // Reset the Users stack to UsersList and navigate to Users tab
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'UsersList' }],
                }),
              );
            },
            style: 'cancel',
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create receipt. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: Platform.OS === 'android' ? 20 : 0 }}>
        <ScrollView style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
          <Text variant="headlineMedium" style={styles.title}>
            Order Overview
          </Text>

      {/* Order Details */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Order Details
          </Text>

          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.infoLabel}>
              Ordered iBeacons:
            </Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {order.beacons}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.infoLabel}>
              Unit Price:
            </Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {formatPrice(10.0)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyLarge" style={styles.infoLabel}>
              Subtotal:
            </Text>
            <Text variant="bodyLarge" style={styles.infoValue}>
              {formatPrice(order.beacons * 10.0)}
            </Text>
          </View>

          {order.discount > 0 && (
            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={styles.infoLabel}>
                Discount:
              </Text>
              <Text variant="bodyLarge" style={[styles.discountValue, { color: '#4CAF50' }]}>
                -{formatPrice(order.discount)}
              </Text>
            </View>
          )}

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant="titleMedium" style={[styles.infoLabel, { fontWeight: 'bold' }]}>
              Total Price:
            </Text>
            <Text variant="titleMedium" style={[styles.priceValue, { fontWeight: 'bold', color: theme.colors.primary }]}>
              {formatPrice(order.price)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Delivery Address */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Delivery Address
          </Text>

          <Text variant="bodyLarge" style={styles.addressText}>
            {deliveryAddress.name}
          </Text>
          <Text variant="bodyMedium" style={styles.addressText}>
            {deliveryAddress.address}
            {deliveryAddress.address2 ? `, ${deliveryAddress.address2}` : ''}
          </Text>
          <Text variant="bodyMedium" style={styles.addressText}>
            {deliveryAddress.postalCode}, {deliveryAddress.city}
          </Text>
          <Text variant="bodyMedium" style={styles.addressText}>
            {deliveryAddress.country}
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleConfirmOrder}
        style={styles.button}
        icon="check-circle"
        buttonColor={theme.colors.primary}
      >
        Confirm and Send Order
      </Button>

        <View style={commonStyles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    textAlign: 'right',
  },
  discountValue: {
    textAlign: 'right',
    fontWeight: '500',
  },
  priceValue: {
    textAlign: 'right',
    fontSize: 18,
  },
  divider: {
    marginVertical: 12,
  },
  addressText: {
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
