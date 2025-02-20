import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, UsersScreenNavigationProp } from '../types/types';
import data from '../data/users.json';
import { useUserContext } from '../contexts/UserContext';

const users: User[] = data as User[]; // Explicitly type the JSON data

const Users = () => {
  const navigation = useNavigation<UsersScreenNavigationProp>();
  const { getUser, setDeliveryAddress } = useUserContext();

  const handleUserSelect = (user: User) => {
    navigation.navigate('Beacons', {
      userId: String(user.id),
      getUser: () => user,
      setDeliveryAddress, // Ensure this is passed
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a User</Text>
      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userBox}
            onPress={() => handleUserSelect(item)}>
            <Text style={styles.userText}>{item.full_name}</Text>
            <Text style={styles.userText}>{item.address1}</Text>
            <Text style={styles.userText}>{item.city}</Text>
            <Text style={styles.userText}>{item.country_name}</Text>
            <Button title="Select" onPress={() => handleUserSelect(item)} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userBox: {
    width: '90%',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  userText: {
    fontSize: 16,
  },
  separator: {
    height: 10,
  },
});

export default Users;
