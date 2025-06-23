import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import store from './app/store/store';
import { RootStackParamList } from './app/types/types';
// import { apiSlice } from './app/services/api/apiSlice'; // Not needed for ApiProvider
// import { ApiProvider } from '@reduxjs/toolkit/query/react'; // Not needed - API reducer is in store

// Screens
import UsersScreen from './app/screens/UsersScreen';
import BeaconsScreen from './app/screens/Beacons';
import DeliveryScreen from './app/screens/Delivery';
import OrderOverviewScreen from './app/screens/OrderOverview';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      {/* ApiProvider removed - not needed since API reducer is already in store */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <Stack.Navigator initialRouteName="Users">
            <Stack.Screen
              name="Users"
              component={UsersScreen}
              options={{ title: 'Users' }}
            />
            <Stack.Screen
              name="Beacons"
              component={BeaconsScreen}
              options={{ title: 'Beacons' }}
            />
            <Stack.Screen
              name="Delivery"
              component={DeliveryScreen}
              options={{ title: 'Delivery' }}
            />
            <Stack.Screen
              name="OrderOverview"
              component={OrderOverviewScreen}
              options={{ title: 'Order Overview' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default App;
