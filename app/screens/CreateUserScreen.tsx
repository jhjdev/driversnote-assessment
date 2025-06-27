import React, { useState } from 'react';
import { View, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  Chip,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { RootState, AppDispatch } from '../store/store';
import { createUser } from '../store/user/userSlice';
import { User } from '../types/types';
import { commonStyles, formStyles, createThemedStyles } from '../styles';

export default function CreateUserScreen () {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { loading } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [discount, setDiscount] = useState(10);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const discountTags = ['VIP', 'Student', 'Senior', 'Employee', 'First Time', 'Loyalty'];
  const countries = ['USA', 'Canada', 'Australia', 'Denmark', 'UK', 'Germany'];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag],
    );
  };

  const handleCreateUser = async () => {
    // Reset errors
    setNameError('');
    setEmailError('');

    // Validation
    let hasErrors = false;

    if (!name.trim()) {
      setNameError('Name is required');
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      // Create user data
      const userData: Omit<User, 'id'> = {
        full_name: name,
        tag: selectedTags.length > 0 ? selectedTags.join(', ') : 'user',
        discount, // Save the discount percentage
        address1: address || null,
        address2: null,
        postal_code: postalCode ? (isNaN(Number(postalCode)) ? postalCode : Number(postalCode)) : null,
        city: city || null,
        country_name: country,
        country_id: country.toLowerCase().substring(0, 2),
        organisation_id: null,
      };

      // Dispatch the create user action
      await dispatch(createUser(userData)).unwrap();

      Alert.alert(
        'User Created Successfully!',
        `${name} has been added to your users list.`,
        [
          {
            text: 'View Users',
            onPress: () => {
              // Navigate to Users tab
              navigation.navigate('Users' as never);
            },
          },
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form
              setName('');
              setEmail('');
              setPhone('');
              setAddress('');
              setCity('');
              setPostalCode('');
              setCountry('USA');
              setDiscount(10);
              setSelectedTags([]);
            },
            style: 'cancel',
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create user. Please try again.');
    }
  };

  const themedStyles = createThemedStyles(theme);

  return (
    <SafeAreaView style={[commonStyles.containerNoPadding, themedStyles.background]}>
      <View style={[commonStyles.safeContainer, themedStyles.background]}>
        <ScrollView style={[commonStyles.container, themedStyles.background]}>
          <Text variant="headlineMedium" style={commonStyles.title}>
            Create New User
          </Text>

      <Card style={commonStyles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={commonStyles.sectionTitle}>
            User Information
          </Text>

          <TextInput
            label="Full Name *"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) setNameError('');
            }}
            mode="outlined"
            style={commonStyles.input}
            error={!!nameError}
          />
          <HelperText type="error" visible={!!nameError}>
            {nameError}
          </HelperText>

          <TextInput
            label="Email Address *"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            mode="outlined"
            style={commonStyles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            style={commonStyles.input}
            keyboardType="phone-pad"
          />
        </Card.Content>
      </Card>

      <Card style={commonStyles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={commonStyles.sectionTitle}>
            Address Information
          </Text>

          <TextInput
            label="Address Line 1"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={commonStyles.input}
          />

          <View style={formStyles.row}>
            <TextInput
              label="City"
              value={city}
              onChangeText={setCity}
              mode="outlined"
              style={[commonStyles.input, formStyles.halfWidth]}
            />
            <TextInput
              label="Postal Code"
              value={postalCode}
              onChangeText={setPostalCode}
              mode="outlined"
              style={[commonStyles.input, formStyles.halfWidth]}
            />
          </View>

          <TextInput
            label="Country"
            value={country}
            onChangeText={setCountry}
            mode="outlined"
            style={commonStyles.input}
          />
        </Card.Content>
      </Card>

      <Card style={commonStyles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={commonStyles.sectionTitle}>
            Discount Settings
          </Text>

          <View style={formStyles.discountContainer}>
            <Text variant="bodyLarge" style={formStyles.discountLabel}>
              Discount: {discount}%
            </Text>
            <Slider
              style={formStyles.slider}
              minimumValue={0}
              maximumValue={50}
              value={discount}
              onValueChange={setDiscount}
              step={5}
              thumbColor={theme.colors.primary}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.outline}
            />
            <View style={formStyles.sliderLabels}>
              <Text variant="bodySmall">0%</Text>
              <Text variant="bodySmall">50%</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={commonStyles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={commonStyles.sectionTitle}>
            Customer Tags
          </Text>
          <Text variant="bodySmall" style={commonStyles.subtitle}>
            Select applicable tags for this customer
          </Text>

          <View style={formStyles.tagsContainer}>
            {discountTags.map((tag) => (
              <Chip
                key={tag}
                selected={selectedTags.includes(tag)}
                onPress={() => handleTagToggle(tag)}
                style={formStyles.tag}
                showSelectedOverlay
              >
                {tag}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleCreateUser}
        style={commonStyles.button}
        icon="account-plus"
      >
        Create User
      </Button>

        <View style={commonStyles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
