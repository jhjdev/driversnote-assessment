import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, List, IconButton, ActivityIndicator, Dialog, TextInput, Button, Portal, Snackbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUsers, updateUser, deleteUser, selectUser, setSelectedUser } from '../store/user/userSlice';
import { User } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { commonStyles, userCardStyles, textStyles } from '../styles';
export default function UsersScreen() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedTag, setEditedTag] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const handleUserPress = (user: User) => {
    dispatch(setSelectedUser(user));
    // Navigate to beacon selection screen
    navigation.navigate('Beacons' as never, { userId: user.id } as never);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditedName(user.full_name);
    setEditedTag(user.tag || '');
    setShowEditDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.full_name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteUser(user.id))
        }
      ]
    );
  };

  const handleSaveEdit = () => {
    if (editingUser && editedName.trim()) {
      dispatch(updateUser({
        id: editingUser.id,
        userData: {
          full_name: editedName.trim(),
          tag: editedTag.trim() || 'user'
        }
      }));
      setShowEditDialog(false);
      setEditingUser(null);
    }
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
    setEditingUser(null);
    setEditedName('');
    setEditedTag('');
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={textStyles.loadingText}>
          Loading users...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={[commonStyles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineMedium" style={commonStyles.title}>
          Users
        </Text>
        
        {users.length === 0 ? (
          <View style={commonStyles.emptyContainer}>
            <Text variant="bodyLarge" style={textStyles.emptyText}>
              No users found. Create a new user to get started.
            </Text>
          </View>
        ) : (
          users.map((user) => (
            <Card key={user.id} style={commonStyles.smallCard} mode="outlined">
              <TouchableOpacity onPress={() => handleUserPress(user)}>
                <Card.Content>
                  <List.Item
                    title={user.full_name}
                    description={`Tag: ${user.tag || 'user'} • ${user.city || 'Unknown City'}, ${user.country_name || 'Unknown Country'}`}
                    left={(props) => <List.Icon {...props} icon="account" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  />
                  {user.address1 && (
                    <Text variant="bodySmall" style={userCardStyles.address}>
                      {user.address1}
                      {user.address2 && `, ${user.address2}`}
                      {user.postal_code && ` - ${user.postal_code}`}
                    </Text>
                  )}
                </Card.Content>
              </TouchableOpacity>
              <Card.Actions style={userCardStyles.actions}>
                <IconButton 
                  icon="pencil" 
                  mode="outlined" 
                  size={20}
                  onPress={() => handleEditUser(user)}
                />
                <IconButton 
                  icon="delete" 
                  mode="outlined" 
                  size={20}
                  iconColor={theme.colors.error}
                  onPress={() => handleDeleteUser(user)}
                />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
      
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={handleCancelEdit}>
          <Dialog.Title>Edit User</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Full Name"
              value={editedName}
              onChangeText={setEditedName}
              mode="outlined"
              style={commonStyles.input}
            />
            <TextInput
              label="Tag"
              value={editedTag}
              onChangeText={setEditedTag}
              mode="outlined"
              style={commonStyles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelEdit}>Cancel</Button>
            <Button 
              mode="contained" 
              onPress={handleSaveEdit}
              disabled={!editedName.trim()}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error || 'An error occurred'}
      </Snackbar>
    </>
  );
}

