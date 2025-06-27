import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';
import { Text, Card, List, IconButton, ActivityIndicator, Dialog, TextInput, Button, Portal, Snackbar, useTheme, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUsers, updateUser, deleteUser, selectUser, setSelectedUser } from '../store/user/userSlice';
import { User } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { commonStyles, userCardStyles, textStyles, createThemedStyles } from '../styles';
export default function UsersScreen () {
  const theme = useTheme();
  const themedStyles = createThemedStyles(theme);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedTag, setEditedTag] = useState('');
  const [editedAddress1, setEditedAddress1] = useState('');
  const [editedCity, setEditedCity] = useState('');
  const [editedPostalCode, setEditedPostalCode] = useState('');
  const [editedCountryName, setEditedCountryName] = useState('');
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
    setEditedAddress1(user.address1 || '');
    setEditedCity(user.city || '');
    setEditedPostalCode(user.postal_code?.toString() || '');
    setEditedCountryName(user.country_name || '');
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
          onPress: () => dispatch(deleteUser(user.id)),
        },
      ],
    );
  };

  const handleSaveEdit = () => {
    if (editingUser && editedName.trim()) {
      dispatch(updateUser({
        id: editingUser.id,
        userData: {
          full_name: editedName.trim(),
          tag: editedTag.trim() || 'user',
        },
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
    <SafeAreaView style={[commonStyles.containerNoPadding, themedStyles.background]}>
      <View style={[commonStyles.safeContainer, themedStyles.background]}>
        <ScrollView style={[commonStyles.container, themedStyles.background]}>
          <Text variant="headlineMedium" style={commonStyles.title}>
            Users
          </Text>

        {users.length === 0
          ? (
          <View style={commonStyles.emptyContainer}>
            <Text variant="bodyLarge" style={textStyles.emptyText}>
              No users found. Create a new user to get started.
            </Text>
          </View>
            )
          : (
              users.map((user) => (
            <Card key={user.id} style={commonStyles.smallCard} mode="outlined">
              <TouchableOpacity onPress={() => handleUserPress(user)}>
                <Card.Content>
                  <List.Item
                    title={user.full_name}
                    description={`${user.city || 'Unknown City'}, ${user.country_name || 'Unknown Country'}`}
                    left={(props) => <List.Icon {...props} icon="account" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  />
                  {user.tag && user.tag !== 'user' && (
                    <View style={userCardStyles.tagsContainer}>
                      {user.tag.split(', ').map((tag, index) => (
                        <Chip key={index} style={userCardStyles.tagChip} textStyle={userCardStyles.tagChipText} compact>
                          {tag}
                        </Chip>
                      ))}
                    </View>
                  )}
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
      </View>

      <Portal>
        <Dialog visible={showEditDialog} onDismiss={handleCancelEdit}>
          <Dialog.Title>Edit User</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 400 }}>
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
                placeholder="e.g., VIP, Student, Senior"
              />
              <TextInput
                label="Address"
                value={editedAddress1}
                onChangeText={setEditedAddress1}
                mode="outlined"
                style={commonStyles.input}
              />
              <TextInput
                label="City"
                value={editedCity}
                onChangeText={setEditedCity}
                mode="outlined"
                style={commonStyles.input}
              />
              <TextInput
                label="Postal Code"
                value={editedPostalCode}
                onChangeText={setEditedPostalCode}
                mode="outlined"
                style={commonStyles.input}
              />
              <TextInput
                label="Country"
                value={editedCountryName}
                onChangeText={setEditedCountryName}
                mode="outlined"
                style={commonStyles.input}
              />
            </ScrollView>
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
    </SafeAreaView>
  );
}
