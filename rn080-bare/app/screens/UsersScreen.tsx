import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetUsersQuery } from '../services/api/apiSlice';
import { selectUsersSortedByName } from '../store/user/userSelectors';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { UsersScreenNavigationProp } from '../types/types';

export const UsersScreen: React.FC = () => {
  const navigation = useNavigation<UsersScreenNavigationProp>();

  // Use RTK Query hook to fetch users
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  // Use selector to get sorted users (if data is available)
  const sortedUsers = useSelector((state: RootState) =>
    users ? selectUsersSortedByName(state) : [],
  );

  const handleUserSelect = (userId: string) => {
    navigation.navigate('Beacons', { userId });
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>
          {error instanceof Error
            ? error.message
            : 'An error occurred while fetching users'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a User</Text>
      <FlatList
        data={sortedUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => handleUserSelect(item.id.toString())}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.full_name}</Text>
              <Text style={styles.userDetails}>
                {item.city}
                {item.city && item.country_name ? ', ' : ''}
                {item.country_name}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.selectButton}>
                <Text style={styles.buttonText}>Select</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
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
  userDetails: {
    fontSize: 14,
    color: '#666',
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

export default UsersScreen;
