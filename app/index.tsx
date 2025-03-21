import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Users from './screens/UsersList';
import Beacons from './screens/Beacons';
import Delivery from './screens/Delivery';
import OrderOverview from './screens/OrderOverview';
import { RootStackParamList, User } from './types/types';
import { UserProvider } from './contexts/UserContext';
import data from './data/users.json';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const users: User[] = data as User[];

  const getUser = (userId: string) =>
    users.find(user => String(user.id) === userId); // Correct implementation
  const setDeliveryAddress = (address: any) => {}; // Provide your actual implementation here

  return (
    <UserProvider getUser={getUser} setDeliveryAddress={setDeliveryAddress}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Users">
          <Stack.Screen name="Users" component={Users} />
          <Stack.Screen name="Beacons" component={Beacons} />
          <Stack.Screen name="Delivery" component={Delivery} />
          <Stack.Screen name="OrderOverview" component={OrderOverview} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
