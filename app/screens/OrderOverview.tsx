import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Text, Button, Overlay } from 'react-native-elements';
import { NavigationProps } from '../types/types';

const OrderOverview = (props: NavigationProps<'OrderOverview'>) => {
  const [isVisible, setVisible] = useState(false);
  const order = props.route.params.getOrder();
  const deliveryAddress = props.route.params.getDeliveryAddress();

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View
        style={{
          height: '50%',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text h2 style={{ color: '#27AAE1' }}>
          Order Overview
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Ordered iBeacons: {order.beacons}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Full Price: {order.price}
        </Text>
        <Text h4>Delivery Address</Text>
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
          {deliveryAddress.name}
        </Text>
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
          {deliveryAddress.address},&nbsp;
          {deliveryAddress.postalCode}
        </Text>
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
          {deliveryAddress.city},&nbsp;
          {deliveryAddress.country}
        </Text>
        <Button
          title="Confirm and send the order"
          type="outline"
          style={{ width: '90%' }}
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

export default OrderOverview;
