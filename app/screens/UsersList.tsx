import React from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { users } from '../data/Users';
import { NavigationProps } from '../types/types';

const UsersList = (props: NavigationProps<'Users'>) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={user => `${user.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userBox}
            onPress={() => {
              props.navigation.navigate('Beacons', {
                userId: item.id.toString(),
                getUser: () => item,
              });
            }}>
            <Text style={styles.userText}>{item.full_name || '-'}</Text>
            <Text style={styles.userText}>{item.country_name}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
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

export default UsersList;
