import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useNavigation, useNavigationState, CommonActions } from '@react-navigation/native';

// Import screens
import UsersScreen from '../screens/UsersScreen';
import BeaconsScreen from '../screens/BeaconsScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import OrderOverviewScreen from '../screens/OrderOverviewScreen';

// Define the stack param list
export type UserStackParamList = {
  UsersList: undefined;
  Beacons: { userId: number };
  Delivery: { order: any; userId: number };
  OrderOverview: { order: any; userId: number };
};

const Stack = createStackNavigator<UserStackParamList>();

export default function UserStackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="UsersList"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="UsersList" 
        component={UsersScreen}
        options={{
          title: 'Select User',
          headerShown: false, // We'll show this in the tab bar
        }}
      />
      <Stack.Screen 
        name="Beacons" 
        component={BeaconsScreen}
        options={{
          title: 'Select Beacons',
        }}
      />
      <Stack.Screen 
        name="Delivery" 
        component={DeliveryScreen}
        options={{
          title: 'Delivery Address',
        }}
      />
      <Stack.Screen 
        name="OrderOverview" 
        component={OrderOverviewScreen}
        options={{
          title: 'Order Overview',
        }}
      />
    </Stack.Navigator>
  );
}
