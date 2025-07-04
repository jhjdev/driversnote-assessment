import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, useTheme } from 'react-native-paper';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { StackNavigationProp } from '@react-navigation/stack';

interface DeliveryScreenProps {
  route: RouteProp<{ params: { order: any; userId: number } }, 'params'>;
}

type DeliveryNavigationProp = StackNavigationProp<
  { OrderOverview: { order: any; userId: number } },
  'OrderOverview'
>;

export default function DeliveryScreen({ route }: DeliveryScreenProps) {
  const theme = useTheme();
  const navigation = useNavigation<DeliveryNavigationProp>();
  const { order, userId } = route.params;
  const { selectedUser } = useSelector((state: RootState) => state.user);
  const user = selectedUser;

  // Form state with default values from user data
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    address: user?.address1 || '',
    address2: user?.address2 || '',
    postalCode: user?.postal_code?.toString() || '',
    city: user?.city || '',
    country: user?.country_name || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const deliveryAddress = {
      name: formData.name,
      address: formData.address,
      address2: formData.address2 || undefined,
      postalCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
    };

    navigation.navigate('OrderOverview', {
      order: {
        ...order,
        deliveryAddress,
      },
      userId,
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: Platform.OS === 'android' ? 20 : 0 }}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text variant="headlineMedium" style={styles.title}>
            Delivery Address
          </Text>

      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Confirm Delivery Details
          </Text>

          <TextInput
            label="Full Name *"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.name}
          />
          {errors.name
            ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.name}
            </Text>
              )
            : null}

          <TextInput
            label="Address *"
            value={formData.address}
            onChangeText={(value) => updateField('address', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.address}
          />
          {errors.address
            ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.address}
            </Text>
              )
            : null}

          <TextInput
            label="Address 2 (Optional)"
            value={formData.address2}
            onChangeText={(value) => updateField('address2', value)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Postal Code *"
            value={formData.postalCode}
            onChangeText={(value) => updateField('postalCode', value)}
            mode="outlined"
            style={styles.input}
            keyboardType="default"
            error={!!errors.postalCode}
          />
          {errors.postalCode
            ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.postalCode}
            </Text>
              )
            : null}

          <TextInput
            label="City *"
            value={formData.city}
            onChangeText={(value) => updateField('city', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.city}
          />
          {errors.city
            ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.city}
            </Text>
              )
            : null}

          <TextInput
            label="Country *"
            value={formData.country}
            onChangeText={(value) => updateField('country', value)}
            mode="outlined"
            style={styles.input}
            error={!!errors.country}
          />
          {errors.country
            ? (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.country}
            </Text>
              )
            : null}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        icon="truck-delivery"
      >
        Continue to Order Overview
      </Button>

      <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#B71C1C',
    marginBottom: 8,
    marginLeft: 16,
    fontSize: 12,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
