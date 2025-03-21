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

const UsersList = () => {
  const navigation = useNavigation<UsersScreenNavigationProp>();
  const { getUser, setDeliveryAddress } = useUserContext();

  const handleUserSelect = (user: User) => {
    navigation.navigate('Beacons', {
      userId: String(user.id),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a User</Text>
      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.userBox}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.full_name}</Text>
              <Text style={styles.userText}>{item.address1}</Text>
              <Text style={styles.userText}>{item.city}</Text>
              <Text style={styles.userText}>{item.country_name}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleUserSelect(item)}>
                <Text style={styles.buttonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  userBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
  },
  buttonContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  separator: {
    height: 10,
  },
  selectButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UsersList;
